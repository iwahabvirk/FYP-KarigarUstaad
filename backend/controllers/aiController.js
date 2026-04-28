const User = require('../models/User');

const CATEGORIES = ['plumbing','electrical','painting','cleaning','carpentry'];

// Simple keyword-based AI suggestion (no ML needed for MVP)
exports.suggestJobDetails = async (req, res) => {
  try {
    const { description } = req.body;

    console.log('🤖 AIController: Suggesting job details for description:', description.substring(0, 50) + '...');

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters',
      });
    }

    const descLower = description.toLowerCase();

    // Suggest category based on keywords
    let suggestedCategory = 'plumbing';
    const categoryKeywords = {
      'plumbing': ['plumb', 'pipe', 'drain', 'leak', 'tap', 'toilet', 'sink', 'faucet', 'water'],
      'electrical': ['electric', 'wire', 'switch', 'outlet', 'bulb', 'light', 'panel', 'breaker', 'voltage'],
      'painting': ['paint', 'wall', 'color', 'brush', 'coat', 'finish', 'surface', 'repaint'],
      'carpentry': ['wood', 'door', 'cabinet', 'shelf', 'frame', 'furniture', 'carpen', 'build', 'construct'],
      'cleaning': ['clean', 'dust', 'sweep', 'mop', 'wash', 'laundry', 'sanitize', 'tidy'],
    };

    // Find matching category
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => descLower.includes(keyword))) {
        suggestedCategory = category;
        break;
      }
    }

    // Suggest budget based on category
    const budgetRanges = {
      'plumbing': { min: 2000, max: 10000, suggested: 5000 },
      'electrical': { min: 3000, max: 15000, suggested: 8000 },
      'painting': { min: 5000, max: 20000, suggested: 10000 },
      'carpentry': { min: 5000, max: 25000, suggested: 12000 },
      'cleaning': { min: 1000, max: 5000, suggested: 2500 },
    };

    const budgetRange = budgetRanges[suggestedCategory];

    // Suggest skills based on category
    const skillSuggestions = {
      'plumbing': ['Pipe fitting', 'Water system repair', 'Leak detection'],
      'electrical': ['Wiring', 'Circuit work', 'Safety inspection'],
      'painting': ['Surface preparation', 'Color matching', 'Finish application'],
      'carpentry': ['Cutting', 'Measuring', 'Wood finishing'],
      'cleaning': ['Deep cleaning', 'Sanitization', 'Organization'],
    };

    console.log('✅ AIController: Suggestions generated', {
      category: suggestedCategory,
      budgetSuggested: budgetRange.suggested,
      skills: skillSuggestions[suggestedCategory],
    });

    res.status(200).json({
      success: true,
      data: {
        suggestedCategory,
        budgetRange,
        suggestedBudget: budgetRange.suggested,
        requiredSkills: skillSuggestions[suggestedCategory],
        confidence: 'high',
      },
    });
  } catch (error) {
    console.error('❌ AIController: Error suggesting details', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Suggest only category
exports.suggestCategory = async (req, res) => {
  try {
    const { description } = req.body;

    console.log('🤖 AIController: Suggesting category for description:', description.substring(0, 50) + '...');

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters',
      });
    }

    const descLower = description.toLowerCase();

    // Suggest category based on keywords
    let suggestedCategory = 'plumbing';
    const categoryKeywords = {
      'plumbing': ['plumb', 'pipe', 'drain', 'leak', 'tap', 'toilet', 'sink', 'faucet', 'water'],
      'electrical': ['electric', 'wire', 'switch', 'outlet', 'bulb', 'light', 'panel', 'breaker', 'voltage'],
      'painting': ['paint', 'wall', 'color', 'brush', 'coat', 'finish', 'surface', 'repaint'],
      'carpentry': ['wood', 'door', 'cabinet', 'shelf', 'frame', 'furniture', 'carpen', 'build', 'construct'],
      'cleaning': ['clean', 'dust', 'sweep', 'mop', 'wash', 'laundry', 'sanitize', 'tidy'],
    };

    // Find matching category
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => descLower.includes(keyword))) {
        suggestedCategory = category;
        break;
      }
    }

    console.log('✅ AIController: Category suggested', { category: suggestedCategory });

    res.status(200).json({
      success: true,
      category: suggestedCategory,
    });
  } catch (error) {
    console.error('❌ AIController: Error suggesting category', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Find recommended workers for a job
exports.findMatchingWorkers = async (req, res) => {
  try {
    const { category, location } = req.query;

    console.log('🤖 AIController: Finding matching workers for', { category, location });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    // Find workers with matching skills
    const workers = await User.find({
      role: 'worker',
      skills: category,
      location: location ? { $regex: location, $options: 'i' } : undefined,
    })
      .select('name skills rating totalReviews location phone')
      .lean();

    // Score and sort workers
    const scoredWorkers = workers.map(worker => {
      const score = (worker.rating || 0) * 10 + (worker.totalReviews || 0) * 2;
      return {
        ...worker,
        matchScore: score,
      };
    });

    const topWorkers = scoredWorkers.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

    console.log('✅ AIController: Found', topWorkers.length, 'matching workers');

    res.status(200).json({
      success: true,
      data: topWorkers,
    });
  } catch (error) {
    console.error('❌ AIController: Error finding workers', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate improved job description
exports.generateDescription = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Text must be at least 5 characters',
      });
    }

    // Simple template-based description generation
    const templates = {
      'plumbing': 'Need professional plumbing services for {text}. Looking for experienced plumber to handle repairs, installations, or maintenance work. Please ensure you have proper tools and certifications.',
      'electrical': 'Require skilled electrician for {text}. Need someone qualified to handle electrical work safely and according to building codes. Experience with wiring, outlets, and electrical systems preferred.',
      'painting': 'Looking for painter to handle {text}. Need quality work with attention to detail. Experience with different paint types and surface preparation required.',
      'carpentry': 'Need carpenter for {text}. Looking for skilled woodworker to handle construction, repairs, or custom work. Tools and materials should be provided unless otherwise specified.',
      'cleaning': 'Require cleaning services for {text}. Need thorough and reliable cleaning professional. Experience with various cleaning methods and equipment preferred.',
      'other': 'Need assistance with {text}. Looking for skilled professional to handle this task. Please provide details about your experience and approach.',
    };

    // Determine category from text
    const textLower = text.toLowerCase();
    let category = 'other';
    const categoryKeywords = {
      'plumbing': ['plumb', 'pipe', 'drain', 'leak', 'tap', 'toilet', 'sink', 'faucet', 'water'],
      'electrical': ['electric', 'wire', 'switch', 'outlet', 'bulb', 'light', 'panel', 'breaker', 'voltage'],
      'painting': ['paint', 'wall', 'color', 'brush', 'coat', 'finish', 'surface', 'repaint'],
      'carpentry': ['wood', 'door', 'cabinet', 'shelf', 'frame', 'furniture', 'carpen', 'build', 'construct'],
      'cleaning': ['clean', 'dust', 'sweep', 'mop', 'wash', 'laundry', 'sanitize', 'tidy'],
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        category = cat;
        break;
      }
    }

    const template = templates[category];
    const improvedDescription = template.replace('{text}', text.trim());

    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        improvedDescription,
        suggestedCategory: category,
      },
    });
  } catch (error) {
    console.error('❌ AIController: Error generating description', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
