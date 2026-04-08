const CurrentAffair = require('../models/CurrentAffair');
const Quiz = require('../models/Quiz');
const Resource = require('../models/Resource');
const CutoffPrediction = require('../models/CutoffPrediction');

// --- Daily Bites (Current Affairs & Quiz) ---

exports.getCurrentAffairs = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let affairs = await CurrentAffair.find().sort({ date: -1 }).limit(15);
    
    // If no affairs, generate mock/AI ones for demonstration
    if (affairs.length === 0) {
      const mockAffairs = [
        {
          title: "ISRO launches new communication satellite",
          content: "The Indian Space Research Organisation (ISRO) successfully launched its latest communication satellite, GSAT-20, aimed at providing high-speed internet to remote areas.",
          category: "Science",
          date: new Date()
        },
        {
          title: "RBI keeps repo rate unchanged",
          content: "The Reserve Bank of India maintained the repo rate at its current level to balance inflation and growth.",
          category: "Economy",
          date: new Date()
        },
        {
          title: "India signs new trade agreement with Australia",
          content: "A comprehensive free trade agreement has been signed to boost exports in textiles and pharmaceuticals.",
          category: "International",
          date: new Date()
        }
      ];
      affairs = await CurrentAffair.insertMany(mockAffairs);
    }

    res.json(affairs);
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    res.status(500).json({ error: 'Server error fetching current affairs' });
  }
};

exports.getDailyQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findOne().sort({ date: -1 });

    if (!quiz) {
      quiz = await Quiz.create({
        date: new Date(),
        title: "Daily Current Affairs Quiz",
        questions: [
          {
            question: "Which organisation launched the GSAT-20 satellite?",
            options: ["NASA", "ESA", "ISRO", "Roscosmos"],
            correctAnswer: 2,
            explanation: "ISRO launched the GSAT-20 satellite."
          },
          {
            question: "What is the primary objective of the RBI maintaining the repo rate?",
            options: ["Increase inflation", "Balance inflation and growth", "Decrease employment", "Increase repo rate"],
            correctAnswer: 1,
            explanation: "To balance inflation and growth."
          }
        ]
      });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching daily quiz:', error);
    res.status(500).json({ error: 'Server error fetching daily quiz' });
  }
};

// --- Resources (PYQs & Syllabus) ---

exports.getResources = async (req, res) => {
  try {
    const { exam, type } = req.query;
    const filter = {};
    if (exam) filter.exam = exam;
    if (type) filter.type = type;

    let resources = await Resource.find(filter).sort({ createdAt: -1 });

    if (resources.length === 0) {
      // Mock data
      const mockResources = [
        { title: "UPSC CSE 2023 Prelims GS Paper 1", exam: "UPSC", type: "PYQ", year: "2023", fileUrl: "#" },
        { title: "SSC CGL Syllabus 2024", exam: "SSC CGL", type: "Syllabus", fileUrl: "#" },
        { title: "RRB NTPC CBT 1 Previous Paper", exam: "RRB NTPC", type: "PYQ", year: "2021", fileUrl: "#" }
      ];
      await Resource.insertMany(mockResources);
      resources = await Resource.find(filter).sort({ createdAt: -1 });
    }

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Server error fetching resources' });
  }
};

// --- Salary Calculator ---

exports.calculateSalary = (req, res) => {
  try {
    const { position } = req.body; // e.g., 'SSC Inspector', 'UPSC IAS', 'Bank PO'
    
    // Mock robust logic for salary calculation
    let basePay, daRate, hraRate, ta;
    daRate = 0.50; // 50% DA currently

    switch(position) {
      case 'SSC Inspector':
        basePay = 44900;
        hraRate = 0.27; // X city
        ta = 3600;
        break;
      case 'UPSC IAS':
        basePay = 56100;
        hraRate = 0.27;
        ta = 7200;
        break;
      case 'Bank PO':
        basePay = 36000;
        daRate = 0.40;
        hraRate = 0.10;
        ta = 1500;
        break;
      default:
        basePay = 25500;
        hraRate = 0.09; // Z city
        ta = 1800;
    }

    const da = basePay * daRate;
    const hra = basePay * hraRate;
    const gross = basePay + da + hra + ta;
    const deductions = (basePay + da) * 0.10; // NPS
    const inHand = gross - deductions;

    res.json({
      position,
      breakdown: {
        basePay: Math.round(basePay),
        da: Math.round(da),
        hra: Math.round(hra),
        ta: Math.round(ta),
        grossSalary: Math.round(gross),
        deductions: Math.round(deductions),
        inHandSalary: Math.round(inHand)
      }
    });
  } catch (error) {
    console.error('Error calculating salary:', error);
    res.status(500).json({ error: 'Server error calculating salary' });
  }
};

// --- Cut-off Predictor ---

exports.predictCutoff = async (req, res) => {
  try {
    const { exam, category, expectedMarks } = req.body;

    // Save user's prediction to build community poll
    await CutoffPrediction.create({
      exam,
      category,
      expectedMarks
    });

    // Calculate community predicted cutoff
    const predictions = await CutoffPrediction.find({ exam, category });
    let total = 0;
    predictions.forEach(p => total += p.expectedMarks);
    const average = predictions.length > 0 ? (total / predictions.length) : expectedMarks;

    // Add some variance logic based on standard deviation or predefined diff
    const predictedBase = Math.round(average);

    res.json({
      exam,
      category,
      userExpectedMarks: expectedMarks,
      communityPredictedCutoff: {
        min: predictedBase - 5,
        max: predictedBase + 5
      },
      totalCommunityVotes: predictions.length
    });
  } catch (error) {
    console.error('Error predicting cutoff:', error);
    res.status(500).json({ error: 'Server error predicting cutoff' });
  }
};
