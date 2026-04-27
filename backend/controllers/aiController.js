const User = require('../models/User');

const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Installation', 'Repair', 'Other'];

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
    let suggestedCategory = 'Other';
    const categoryKeywords = {
      'Plumbing': ['plumb', 'pipe', 'drain', 'leak', 'tap', 'toilet', 'sink', 'faucet', 'water'],
      'Electrical': ['electric', 'wire', 'switch', 'outlet', 'bulb', 'light', 'panel', 'breaker', 'voltage'],
      'Painting': ['paint', 'wall', 'color', 'brush', 'coat', 'finish', 'surface', 'repaint'],
      'Carpentry': ['wood', 'door', 'cabinet', 'shelf', 'frame', 'furniture', 'carpen', 'build', 'construct'],
      'Cleaning': ['clean', 'dust', 'sweep', 'mop', 'wash', 'laundry', 'sanitize', 'tidy'],
      'Installation': ['install', 'mount', 'setup', 'assemble', 'fit', 'attach', 'place', 'arrange'],
      'Repair': ['repair', 'fix', 'broken', 'damage', 'issue', 'problem', 'malfunction'],
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
      'Plumbing': { min: 2000, max: 10000, suggested: 5000 },
      'Electrical': { min: 3000, max: 15000, suggested: 8000 },
      'Painting': { min: 5000, max: 20000, suggested: 10000 },
      'Carpentry': { min: 5000, max: 25000, suggested: 12000 },
      'Cleaning': { min: 1000, max: 5000, suggested: 2500 },
      'Installation': { min: 3000, max: 15000, suggested: 8000 },
      'Repair': { min: 1500, max: 8000, suggested: 4000 },
      'Other': { min: 2000, max: 10000, suggested: 5000 },
    };

    const budgetRange = budgetRanges[suggestedCategory];

    // Suggest skills based on category
    const skillSuggestions = {
      'Plumbing': ['Pipe fitting', 'Water system repair', 'Leak detection'],
      'Electrical': ['Wiring', 'Circuit work', 'Safety inspection'],
      'Painting': ['Surface preparation', 'Color matching', 'Finish application'],
      'Carpentry': ['Cutting', 'Measuring', 'Wood finishing'],
      'Cleaning': ['Deep cleaning', 'Sanitization', 'Organization'],
      'Installation': ['Equipment setup', 'Safety compliance', 'Testing'],
      'Repair': ['Diagnostics', 'Problem solving', 'Component replacement'],
      'Other': [],
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
