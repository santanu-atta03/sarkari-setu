const Comment = require('../models/Comment');
const Report = require('../models/Report');
const Job = require('../models/Job');

// --- COMMENTS ---

// Get comments for a job
exports.getJobComments = async (req, res) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const comments = await Comment.find({ job: jobId, parentComment: null, status: 'active' })
      .populate('user', 'name isVerified') // Assuming User model has these fields, minimal for UI
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Fetch replies for these comments if needed, or we can lazy load them.
    // For simplicity, let's fetch 1-level deep replies
    const commentIds = comments.map(c => c._id);
    const replies = await Comment.find({ parentComment: { $in: commentIds }, status: 'active' })
      .populate('user', 'name isVerified')
      .sort('createdAt') // Replies chronological
      .lean();

    // Group replies
    const repliesMap = replies.reduce((acc, reply) => {
      const pid = reply.parentComment.toString();
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push(reply);
      return acc;
    }, {});

    const enrichedComments = comments.map(c => ({
      ...c,
      replies: repliesMap[c._id.toString()] || []
    }));

    const total = await Comment.countDocuments({ job: jobId, parentComment: null, status: 'active' });

    res.json({
      success: true,
      comments: enrichedComments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalComments: total
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Server error fetching comments' });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id; // User authentication required

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let parentComment = null;
    if (parentCommentId) {
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ success: false, message: 'Parent comment not found' });
      }
      // Optional: Prevent deeply nested replies and tie reply to root parent
      if (parentComment.parentComment) {
         parentCommentId = parentComment.parentComment; // Attach to root
      }
    }

    const newComment = new Comment({
      job: jobId,
      user: userId,
      content,
      parentComment: parentCommentId || null
    });

    await newComment.save();
    
    // Populate user info before returning
    await newComment.populate('user', 'name isVerified');

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Server error adding comment' });
  }
};


// --- REPORTS / CROWDSOURCING ---

// Submit a crowd-sourced report/job update
exports.submitReport = async (req, res) => {
  try {
    const { jobId, reportType, description } = req.body;
    const userId = req.user ? req.user.id : null; // Admin should see who reported if logged in, but we might allow anon

    if (!reportType || !description) {
      return res.status(400).json({ success: false, message: 'Report type and description are required' });
    }

    const newReport = new Report({
      reporter: userId,
      job: jobId || null,
      reportType,
      description
    });

    await newReport.save();

    res.status(201).json({ success: true, message: 'Thank you! Your report has been submitted to our team.', report: newReport });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ success: false, message: 'Server error submitting report' });
  }
};
