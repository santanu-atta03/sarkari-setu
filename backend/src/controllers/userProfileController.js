/**
 * User Profile Controller
 *
 * Handles Aspirant Profile, Auto-Eligibility Job Feed,
 * and "My Applications" exam tracking.
 */

const User = require('../models/User');
const Job = require('../models/Job');

/**
 * @desc    Get user profile details
 * @route   GET /api/users/profile
 * @access  Private (User)
 */
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Update Aspirant Profile
 * @route   PUT /api/users/profile
 * @access  Private (User)
 */
exports.updateProfile = async (req, res) => {
  const { profile } = req.body;
  
  if (!profile) {
    return res.status(400).json({ success: false, message: 'Profile data is required' });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { profile } },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Get jobs the user is eligible for based on Aspirant Profile
 * @route   GET /api/users/eligible-jobs
 * @access  Private (User)
 */
exports.getEligibleJobs = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  
  if (!user || !user.profile) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please complete your Aspirant Profile first to get tailored job recommendations.' 
    });
  }

  const { dob, qualification, category } = user.profile;
  
  if (!dob || !qualification) {
    return res.status(400).json({ 
      success: false, 
      message: 'Date of Birth and Qualification are required in your profile to check eligibility.' 
    });
  }

  // Calculate age based on DOB
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Query: Status is published, user meets min/max age, and qualification matches
  const matchQuery = {
    status: 'published',
    qualification: { $in: [qualification, 'Any'] }
  };

  // Build age query carefully; assume jobs without age limits naturally match
  matchQuery.$and = [
    { $or: [{ 'eligibility.minAge': null }, { 'eligibility.minAge': { $lte: age } }] },
    { $or: [{ 'eligibility.maxAge': null }, { 'eligibility.maxAge': { $gte: age } }] }
  ];

  const jobs = await Job.find(matchQuery)
    .sort({ publishedAt: -1 })
    .select('title slug organization state jobType qualification vacancy importantDates category')
    .lean();

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
};

/**
 * @desc    Mark a job as Applied
 * @route   POST /api/users/applications/:jobId
 * @access  Private (User)
 */
exports.applyForJob = async (req, res) => {
  const { jobId } = req.params;
  const { applicationNumber } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const user = await User.findById(req.user.id);
  
  // Check if already applied
  const alreadyApplied = user.appliedJobs.find(app => app.jobId.toString() === jobId);
  
  if (alreadyApplied) {
    // If updating existing application
    if (applicationNumber) {
      alreadyApplied.applicationNumber = applicationNumber;
      await user.save();
      return res.status(200).json({ success: true, message: 'Application updated', data: alreadyApplied });
    }
    return res.status(400).json({ success: false, message: 'You have already saved this job to your applications.' });
  }

  user.appliedJobs.push({
    jobId,
    applicationNumber: applicationNumber || ''
  });

  await user.save();

  res.status(201).json({ success: true, message: 'Job added to your applications timeline.' });
};

/**
 * @desc    Get user's application timeline
 * @route   GET /api/users/applications
 * @access  Private (User)
 */
exports.getMyApplications = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'appliedJobs.jobId',
      select: 'title slug organization importantDates admitCardUrl resultUrl'
    })
    .lean();

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Filter out any where jobId might be null (if a job was deleted from DB)
  const applications = user.appliedJobs.filter(app => app.jobId);

  // Sorting: most recent application first
  applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
};
