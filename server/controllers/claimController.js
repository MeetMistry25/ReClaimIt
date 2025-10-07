const Claim = require('../models/Claim');
const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Submit a claim for an item
exports.submitClaim = async (req, res) => {
  try {
    const { itemId, itemType, answers } = req.body;
    const claimantId = req.user.id; // Changed from req.user._id to req.user.id

    // Validate item exists
    let item;
    if (itemType === 'FoundItem') {
      item = await FoundItem.findById(itemId);
    } else if (itemType === 'LostItem') {
      item = await LostItem.findById(itemId);
    } else {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user already has a pending claim for this item
    const existingClaim = await Claim.findOne({
      itemId,
      claimantId,
      status: 'pending'
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You already have a pending claim for this item' });
    }

    // Create new claim
    const newClaim = new Claim({
      itemId,
      itemType,
      claimantId,
      answers
    });

    await newClaim.save();

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      claim: newClaim
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all claims (admin only)
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('claimantId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (error) {
    console.error('Error getting claims:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get claims by status (admin only)
exports.getClaimsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const claims = await Claim.find({ status })
      .populate('claimantId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (error) {
    console.error('Error getting claims by status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's claims
exports.getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims
    });
  } catch (error) {
    console.error('Error getting user claims:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a claim (admin only)
exports.approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.id;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'This claim has already been processed' });
    }

    // Update claim status
    claim.status = 'approved';
    claim.adminNotes = adminNotes || '';
    claim.reviewedBy = adminId;
    claim.reviewedAt = Date.now();
    await claim.save();

    // Update item status and visibility
    let item;
    if (claim.itemType === 'FoundItem') {
      item = await FoundItem.findById(claim.itemId);
      if (item) {
        item.status = 'claimed';
        item.claimedBy = claim.claimantId;
        item.claimedAt = Date.now();
        item.isVisible = false;
        await item.save();
      }
    } else if (claim.itemType === 'LostItem') {
      item = await LostItem.findById(claim.itemId);
      if (item) {
        item.status = 'claimed';
        item.claimedBy = claim.claimantId;
        item.claimedAt = Date.now();
        item.isVisible = false;
        await item.save();
      }
    }

    if (!item) {
      return res.status(404).json({ message: 'Associated item not found' });
    }

    // Get claimant details for email
    const claimant = await User.findById(claim.claimantId);
    if (!claimant) {
      return res.status(404).json({ message: 'Claimant user not found' });
    }

    // Send email notification
    const pickupLocation = item.pickupLocation || 'Student Center - Lost & Found Office';
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: claimant.email,
      subject: 'Your Claim Has Been Approved - ReClaimIt',
      html: `
        <h2>Good News! Your Claim Has Been Approved</h2>
        <p>Dear ${claimant.name},</p>
        <p>Your claim for the item "${item.itemName}" has been approved.</p>
        <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
        <p><strong>Please Note:</strong> You will need to show your student ID when collecting the item.</p>
        <p>If you have any questions, please contact the Lost & Found office.</p>
        <p>Thank you for using ReClaimIt!</p>
      `
    };

    // Try to send email, but don't fail if email is not configured
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.log('Email notification failed (email not configured):', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Claim approved successfully',
      claim
    });
  } catch (error) {
    console.error('Error approving claim:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Decline a claim (admin only)
exports.declineClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.id;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'This claim has already been processed' });
    }

    // Update claim status
    claim.status = 'declined';
    claim.adminNotes = adminNotes || '';
    claim.reviewedBy = adminId;
    claim.reviewedAt = Date.now();
    await claim.save();

    // Get item details
    let item;
    if (claim.itemType === 'FoundItem') {
      item = await FoundItem.findById(claim.itemId);
    } else if (claim.itemType === 'LostItem') {
      item = await LostItem.findById(claim.itemId);
    }

    if (!item) {
      return res.status(404).json({ message: 'Associated item not found' });
    }

    // Get claimant details for email
    const claimant = await User.findById(claim.claimantId);
    if (!claimant) {
      return res.status(404).json({ message: 'Claimant user not found' });
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: claimant.email,
      subject: 'Your Claim Has Been Declined - ReClaimIt',
      html: `
        <h2>Your Claim Has Been Declined</h2>
        <p>Dear ${claimant.name},</p>
        <p>We regret to inform you that your claim for the item "${item.itemName}" has been declined.</p>
        ${adminNotes ? `<p><strong>Reason:</strong> ${adminNotes}</p>` : ''}
        <p>If you believe this is an error or would like more information, please contact the Lost & Found office.</p>
        <p>Thank you for using ReClaimIt!</p>
      `
    };

    // Try to send email, but don't fail if email is not configured
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.log('Email notification failed (email not configured):', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Claim declined successfully',
      claim
    });
  } catch (error) {
    console.error('Error declining claim:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get claim details
exports.getClaimDetails = async (req, res) => {
  try {
    const { claimId } = req.params;
    
    const claim = await Claim.findById(claimId)
      .populate('claimantId', 'name email')
      .populate('reviewedBy', 'name email');
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Get item details
    let item;
    if (claim.itemType === 'FoundItem') {
      item = await FoundItem.findById(claim.itemId);
    } else if (claim.itemType === 'LostItem') {
      item = await LostItem.findById(claim.itemId);
    }

    if (!item) {
      return res.status(404).json({ message: 'Associated item not found' });
    }
    res.status(200).json({
      success: true,
      claim,
      item
    });
  } catch (error) {
    console.error('Error getting claim details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a claim (admin only)
exports.deleteClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const adminId = req.user.id;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ 
        success: false,
        message: 'Claim not found' 
      });
    }

    // If the claim was approved, we need to revert the item status
    if (claim.status === 'approved') {
      let item;
      if (claim.itemType === 'FoundItem') {
        item = await FoundItem.findById(claim.itemId);
        if (item) {
          item.status = 'available';
          item.claimedBy = null;
          item.claimedAt = null;
          item.isVisible = true;
          await item.save();
        }
      } else if (claim.itemType === 'LostItem') {
        item = await LostItem.findById(claim.itemId);
        if (item) {
          item.status = 'available';
          item.claimedBy = null;
          item.claimedAt = null;
          item.isVisible = true;
          await item.save();
        }
      }
    }

    // Delete the claim
    await Claim.findByIdAndDelete(claimId);

    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};