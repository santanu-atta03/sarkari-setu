/**
 * Admin Dashboard Controller — SarkariSetu
 * 
 * Provides aggregated statistics and real-time data for the admin overview.
 */

const Job = require('../models/Job');
const Admin = require('../models/Admin');
const User = require('../models/User');

/**
 * GET /api/admin/dashboard-stats
 * Returns key metrics for the admin dashboard.
 */
exports.getDashboardStats = async (req, res) => {
  const [
    totalJobs,
    draftJobs,
    totalViewsResult,
    totalAdmins,
    totalUsers,
    recentJobs
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: 'draft' }),
    Job.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]),
    Admin.countDocuments({ isActive: true }),
    User.countDocuments(),
    Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title organization status viewCount createdAt')
      .lean()
  ]);

  const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

  return res.json({
    success: true,
    data: {
      stats: {
        totalJobs,
        pendingDrafts: draftJobs,
        totalViews,
        activeAdmins: totalAdmins,
        totalUsers
      },
      recentJobs: recentJobs.map(job => ({
        id: job._id,
        title: job.title,
        org: job.organization,
        status: job.status.charAt(0).toUpperCase() + job.status.slice(1),
        views: job.viewCount,
        date: job.createdAt
      }))
    }
  });
};

/**
 * GET /api/admin/jobs
 * Admin console route to list all jobs, including drafts and archived.
 */
exports.listAdminJobs = async (req, res) => {
  let { page = 1, limit = 10, status, q } = req.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  const filter = {};
  
  if (status && status !== 'all' && status !== '') {
    filter.status = status;
  }
  
  if (q) {
    filter.$text = { $search: q };
  }

  const skip = (page - 1) * limit;
  const sortQuery = q ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
  const projection = q ? { score: { $meta: 'textScore' } } : {};

  const [jobs, total] = await Promise.all([
    Job.find(filter, projection)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select('title slug organization state jobType featuredImage viewCount isTrending status createdAt')
      .lean(),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,
    data: jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};
