/**
 * Job Validation Schemas (Joi)
 *
 * All request bodies that touch Job data pass through these validators
 * before reaching the controller. Keeps controllers clean.
 */

const Joi = require('joi');

// ─── Reusable shared schemas ───────────────────────────────────────────────────

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ 'string.pattern.base': '{{#label}} must be a valid MongoDB ObjectId' });

const importantDatesSchema = Joi.object({
  applicationStart: Joi.date().allow(null, ''),
  applicationEnd: Joi.date().allow(null, ''),
  examDate: Joi.date().allow(null, ''),
  admitCardDate: Joi.date().allow(null, ''),
  resultDate: Joi.date().allow(null, ''),
  customDates: Joi.array().items(
    Joi.object({
      label: Joi.string().trim().max(100),
      date: Joi.date(),
    })
  ),
});

const eligibilitySchema = Joi.object({
  minAge: Joi.number().integer().min(0).max(100).allow(null),
  maxAge: Joi.number().integer().min(0).max(100).allow(null),
  ageRelaxation: Joi.string().trim().max(500).allow(''),
  qualifications: Joi.array().items(Joi.string().trim()),
  experience: Joi.string().trim().max(500).allow(''),
  otherCriteria: Joi.string().trim().max(1000).allow(''),
});

const applicationFeeSchema = Joi.object({
  general: Joi.number().min(0),
  obc: Joi.number().min(0),
  scSt: Joi.number().min(0),
  exServicemen: Joi.number().min(0),
  female: Joi.number().min(0),
  paymentMode: Joi.string().trim().max(100).allow(''),
});

const vacancySchema = Joi.object({
  total: Joi.number().integer().min(0),
  general: Joi.number().integer().min(0),
  obc: Joi.number().integer().min(0),
  sc: Joi.number().integer().min(0),
  st: Joi.number().integer().min(0),
  ews: Joi.number().integer().min(0),
  ph: Joi.number().integer().min(0),
  breakdown: Joi.array().items(
    Joi.object({
      post: Joi.string().trim().max(200),
      count: Joi.number().integer().min(0),
    })
  ),
});

const seoSchema = Joi.object({
  metaTitle: Joi.string().trim().max(70).allow(''),
  metaDescription: Joi.string().trim().max(160).allow(''),
  keywords: Joi.array().items(Joi.string().trim().max(50)),
  canonicalUrl: Joi.string().trim().uri().allow(''),
  ogImage: Joi.string().trim().allow(''),
  schemaMarkup: Joi.object().allow(null),
});

const faqSchema = Joi.array().items(
  Joi.object({
    question: Joi.string().trim().max(500).required(),
    answer: Joi.string().trim().max(2000).required(),
  })
);

// ─── JOB_TYPE and QUALIFICATION enums (mirrors Mongoose model) ─────────────────

const JOB_TYPES = [
  'Central Government', 'State Government', 'PSU', 'Defence', 'Police',
  'Railway', 'Banking', 'Teaching', 'Engineering', 'Medical', 'Other',
];

const QUALIFICATIONS = [
  '8th Pass', '10th Pass', '12th Pass', 'Diploma', 'Graduate',
  'Post Graduate', 'PhD', 'Any',
];

// ─── Create Job ────────────────────────────────────────────────────────────────

const createJobSchema = Joi.object({
  // Required fields
  title: Joi.string().trim().min(5).max(200).required(),
  organization: Joi.string().trim().min(2).max(200).required(),
  state: Joi.string().trim().min(2).max(100).required(),
  jobType: Joi.string().valid(...JOB_TYPES).required(),
  qualification: Joi.string().valid(...QUALIFICATIONS).required(),
  shortDescription: Joi.string().trim().min(20).max(500).required(),

  // Optional fields
  slug: Joi.string().trim().lowercase().max(250).allow(''),
  department: Joi.string().trim().max(200).allow(''),
  district: Joi.string().trim().max(100).allow(''),
  category: Joi.string().trim().max(100).allow(''),
  fullContent: Joi.string().allow(''),
  notificationPdfUrl: Joi.string().trim().uri().allow(''),
  applyOnlineUrl: Joi.string().trim().uri().allow(''),
  officialWebsite: Joi.string().trim().uri().allow(''),
  featuredImage: Joi.string().trim().allow(''),
  tags: Joi.array().items(Joi.string().trim().lowercase().max(50)).max(20),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  isTrending: Joi.boolean(),
  isFeatured: Joi.boolean(),
  expiresAt: Joi.date().allow(null),
  salaryMin: Joi.number().min(0).allow(null),
  salaryMax: Joi.number().min(0).allow(null),
  salaryUnit: Joi.string().valid('monthly', 'annual', 'daily'),

  // Sub-documents
  eligibility: eligibilitySchema,
  importantDates: importantDatesSchema,
  applicationFee: applicationFeeSchema,
  vacancy: vacancySchema,
  seo: seoSchema,
  faqs: faqSchema,
  relatedJobs: Joi.array().items(objectId).max(10),
});

// ─── Update Job (all fields optional) ─────────────────────────────────────────

const updateJobSchema = createJobSchema.fork(
  ['title', 'organization', 'state', 'jobType', 'qualification', 'shortDescription'],
  (field) => field.optional()
);

// ─── Query/Filter params for listing ──────────────────────────────────────────

const listJobsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sort: Joi.string()
    .valid('newest', 'oldest', 'views', 'trending')
    .default('newest'),
  status: Joi.string().valid('draft', 'published', 'archived', 'expired').default('published'),
  state: Joi.string().trim().max(100).allow(''),
  jobType: Joi.string().valid(...JOB_TYPES).allow(''),
  qualification: Joi.string().valid(...QUALIFICATIONS).allow(''),
  category: Joi.string().trim().max(100).allow(''),
  q: Joi.string().trim().max(200).allow(''), // full-text search query
  isTrending: Joi.boolean(),
  isFeatured: Joi.boolean(),
});

// ─── Validator Middleware Factory ──────────────────────────────────────────────

/**
 * Returns an Express middleware that validates req.body against a Joi schema.
 * On failure, responds with 422 and a structured error list.
 */
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,   // return all errors at once
    stripUnknown: true,  // remove unrecognized fields
    convert: true,       // coerce types (string → number, etc.)
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }

  req.body = value; // replace with sanitized value
  return next();
};

/**
 * Returns an Express middleware that validates req.query against a Joi schema.
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return res.status(400).json({ success: false, message: 'Invalid query parameters', errors });
  }

  req.query = value;
  return next();
};

module.exports = {
  validateBody,
  validateQuery,
  createJobSchema,
  updateJobSchema,
  listJobsQuerySchema,
};
