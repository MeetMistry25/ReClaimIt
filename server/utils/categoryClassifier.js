// Category classification and auto-suggestion utility
const categoryClassifier = {
  // Predefined categories with keywords
  categories: {
    'Electronics': {
      keywords: ['laptop', 'phone', 'computer', 'tablet', 'charger', 'headphones', 'earbuds', 'camera', 'ipad', 'macbook', 'iphone', 'android', 'wireless', 'bluetooth', 'usb', 'cable', 'adapter', 'power', 'battery'],
      priority: 1
    },
    'Documents': {
      keywords: ['id', 'card', 'license', 'passport', 'certificate', 'diploma', 'transcript', 'receipt', 'ticket', 'voucher', 'coupon', 'check', 'money', 'cash', 'credit', 'debit', 'insurance'],
      priority: 2
    },
    'Clothing': {
      keywords: ['shirt', 'pants', 'jeans', 'dress', 'skirt', 'jacket', 'coat', 'sweater', 'hoodie', 'sweatshirt', 't-shirt', 'blouse', 'suit', 'tie', 'belt', 'shoes', 'boots', 'sneakers', 'sandals', 'socks', 'underwear'],
      priority: 3
    },
    'Accessories': {
      keywords: ['wallet', 'purse', 'bag', 'backpack', 'water bottle', 'umbrella', 'glasses', 'sunglasses', 'watch', 'jewelry', 'ring', 'necklace', 'bracelet', 'earrings', 'hat', 'cap', 'scarf', 'gloves', 'mittens'],
      priority: 4
    },
    'Books': {
      keywords: ['book', 'textbook', 'notebook', 'journal', 'diary', 'magazine', 'novel', 'dictionary', 'encyclopedia', 'manual', 'guide', 'workbook', 'planner', 'calendar'],
      priority: 5
    },
    'Keys': {
      keywords: ['key', 'keys', 'keychain', 'keyring', 'house key', 'car key', 'office key', 'lock'],
      priority: 6
    },
    'ID Cards': {
      keywords: ['id card', 'student id', 'employee id', 'badge', 'access card', 'library card', 'membership card'],
      priority: 7
    },
    'Wallets': {
      keywords: ['wallet', 'purse', 'billfold', 'money clip', 'card holder'],
      priority: 8
    },
    'Others': {
      keywords: ['miscellaneous', 'unknown', 'other', 'various', 'assorted'],
      priority: 9
    }
  },

  // Auto-suggest category based on item name and description
  suggestCategory: (itemName, description = '') => {
    const text = `${itemName} ${description}`.toLowerCase();
    const scores = {};

    // Calculate scores for each category
    Object.keys(categoryClassifier.categories).forEach(category => {
      const categoryData = categoryClassifier.categories[category];
      let score = 0;

      categoryData.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += 1;
        }
      });

      // Normalize score by number of keywords and apply priority
      const normalizedScore = score / categoryData.keywords.length;
      scores[category] = normalizedScore * (1 / categoryData.priority);
    });

    // Find the category with highest score
    let bestCategory = 'Others'; // Default
    let bestScore = 0;

    Object.keys(scores).forEach(category => {
      if (scores[category] > bestScore) {
        bestScore = scores[category];
        bestCategory = category;
      }
    });

    return {
      suggestedCategory: bestCategory,
      confidence: bestScore,
      allScores: scores
    };
  },

  // Get all available categories
  getAllCategories: () => {
    return Object.keys(categoryClassifier.categories).sort((a, b) => {
      return categoryClassifier.categories[a].priority - categoryClassifier.categories[b].priority;
    });
  },

  // Get category keywords
  getCategoryKeywords: (category) => {
    return categoryClassifier.categories[category]?.keywords || [];
  },

  // Validate if a category exists
  isValidCategory: (category) => {
    return Object.keys(categoryClassifier.categories).includes(category);
  },

  // Get similar categories based on keywords
  getSimilarCategories: (category, limit = 3) => {
    if (!categoryClassifier.isValidCategory(category)) {
      return [];
    }

    const targetKeywords = categoryClassifier.categories[category].keywords;
    const similarities = [];

    Object.keys(categoryClassifier.categories).forEach(cat => {
      if (cat !== category) {
        const catKeywords = categoryClassifier.categories[cat].keywords;
        let commonKeywords = 0;

        targetKeywords.forEach(keyword => {
          if (catKeywords.includes(keyword)) {
            commonKeywords++;
          }
        });

        const similarity = commonKeywords / Math.max(targetKeywords.length, catKeywords.length);
        similarities.push({ category: cat, similarity });
      }
    });

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.category);
  },

  // Get category statistics
  getCategoryStats: async () => {
    const stats = {};
    Object.keys(categoryClassifier.categories).forEach(category => {
      stats[category] = {
        keywordCount: categoryClassifier.categories[category].keywords.length,
        priority: categoryClassifier.categories[category].priority
      };
    });
    return stats;
  }
};

module.exports = categoryClassifier; 