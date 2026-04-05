/**
 * Job Mongoose Model
 *
 * Represents a government job posting on SarkariSetu.
 * Includes SEO metadata, eligibility details, important dates,
 * and full schema markup support for structured data.
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

// ─── Sub-Schemas ──────────────────────────────────────────────────────────────

/**
 * Important dates sub-schema (application open/close, exam date, etc.)
 */
const ImportantDatesSchema = new mongoose.Schema(
  {
    applicationStart: { type: Date, default: null },
    applicationEnd: { type: Date, default: null },
    examDate: { type: Date, default: null },
    admitCardDate: { type: Date, default: null },
    resultDate: { type: Date, default: null },
    customDates: [
      {
        label: { type: String, trim: true },
        date: { type: Date },
      },
    ],
  },
  { _id: false }
);

/**
 * Eligibility criteria sub-schema
 */
const EligibilitySchema = new mongoose.Schema(
  {
    minAge: { type: Number, default: null },
    maxAge: { type: Number, default: null },
    ageRelaxation: { type: String, trim: true, default: '' },
    qualifications: [{ type: String, trim: true }],    // e.g. ['10th Pass', '12th Pass', 'Graduate']
    experience: { type: String, trim: true, default: '' },
    otherCriteria: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

/**
 * Application fee sub-schema
 */
const ApplicationFeeSchema = new mongoose.Schema(
  {
    general: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    scSt: { type: Number, default: 0 },
    exServicemen: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    paymentMode: { type: String, trim: true, default: '' }, // e.g. 'Online', 'Challan'
  },
  { _id: false }
);

/**
 * Vacancy details sub-schema
 */
const VacancySchema = new mongoose.Schema(
  {
    total: { type: Number, default: 0 },
    general: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    ews: { type: Number, default: 0 },
    ph: { type: Number, default: 0 },
    breakdown: [
      {
        post: { type: String, trim: true },
        count: { type: Number },
      },
    ],
  },
  { _id: false }
);

/**
 * SEO metadata sub-schema
 */
const SeoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70, default: '' },
    metaDescription: { type: String, trim: true, maxlength: 160, default: '' },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true, default: '' },
    ogImage: { type: String, trim: true, default: '' },
    schemaMarkup: { type: mongoose.Schema.Types.Mixed, default: null }, // JSON-LD job posting schema
  },
  { _id: false }
);

// ─── Main Job Schema ───────────────────────────────────────────────────────────

const JobSchema = new mongoose.Schema(
  {
    // ── Core Identity ──────────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // ── Organization Info ──────────────────────────────────────────────────────
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxlength: [200, 'Organization name cannot exceed 200 characters'],
    },

    department: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Location & Classification ──────────────────────────────────────────────
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      index: true,
    },

    district: {
      type: String,
      trim: true,
      default: '',
    },

    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: [
          'Central Government',
          'State Government',
          'PSU',
          'Defence',
          'Police',
          'Railway',
          'Banking',
          'Teaching',
          'Engineering',
          'Medical',
          'Other',
        ],
        message: '{VALUE} is not a valid job type',
      },
      index: true,
    },

    category: {
      type: String,
      trim: true,
      default: '',  // e.g. 'SSC', 'UPSC', 'IBPS', 'Railway'
      index: true,
    },

    // ── Qualification ──────────────────────────────────────────────────────────
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      enum: {
        values: [
          '8th Pass',
          '10th Pass',
          '12th Pass',
          'Diploma',
          'Graduate',
          'Post Graduate',
          'PhD',
          'Any',
        ],
        message: '{VALUE} is not a valid qualification',
      },
      index: true,
    },

    // ── Content ────────────────────────────────────────────────────────────────
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },

    fullContent: {
      type: String,
      trim: true,
      default: '',
      // Rich HTML content from admin editor
    },

    notificationPdfUrl: {
      type: String,
      trim: true,
      default: '',
    },

    applyOnlineUrl: {
      type: String,
      trim: true,
      default: '',
    },

    officialWebsite: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Structured Data ────────────────────────────────────────────────────────
    eligibility: EligibilitySchema,
    importantDates: ImportantDatesSchema,
    applicationFee: ApplicationFeeSchema,
    vacancy: VacancySchema,

    // ── Download Links ─────────────────────────────────────────────────────────
    admitCardUrl: {
      type: String,
      trim: true,
      default: '',
    },

    resultUrl: {
      type: String,
      trim: true,
      default: '',
    },

    // Salary range
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    salaryUnit: {
      type: String,
      enum: ['monthly', 'annual', 'daily'],
      default: 'monthly',
    },

    // ── Media ──────────────────────────────────────────────────────────────────
    featuredImage: {
      type: String,
      trim: true,
      default: '',
    },

    // ── SEO ───────────────────────────────────────────────────────────────────
    seo: SeoSchema,

    // ── FAQs (for SEO + UX) ───────────────────────────────────────────────────
    faqs: [
      {
        question: { type: String, trim: true, required: true },
        answer: { type: String, trim: true, required: true },
      },
    ],

    // ── Related Posts ──────────────────────────────────────────────────────────
    relatedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],

    // ── Tags ──────────────────────────────────────────────────────────────────
    tags: [{ type: String, trim: true, lowercase: true }],

    // ── Publishing & Status ────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'expired'],
      default: 'draft',
      index: true,
    },

    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    // ── Analytics ─────────────────────────────────────────────────────────────
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    admitCardDownloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    resultDownloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },

    // ── Authorship ────────────────────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    // ── Scraping Metadata ─────────────────────────────────────────────────────
    sourceUrl: {
      type: String,
      trim: true,
      index: true,
      // unique: true // Maybe not unique if multiple sources list the same URL, we'll check manually
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

// Text index for full-text search across key fields
JobSchema.index(
  {
    title: 'text',
    organization: 'text',
    shortDescription: 'text',
    tags: 'text',
    category: 'text',
  },
  {
    weights: { title: 10, organization: 5, category: 3, shortDescription: 2, tags: 1 },
    name: 'job_search_index',
  }
);

// Compound index for common list queries
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ status: 1, isTrending: -1, viewCount: -1 });
JobSchema.index({ status: 1, state: 1, createdAt: -1 });
JobSchema.index({ status: 1, jobType: 1, createdAt: -1 });
JobSchema.index({ status: 1, qualification: 1, createdAt: -1 });
JobSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });

// New indexes for better performance
JobSchema.index({ organization: 1 });
JobSchema.index({ 'eligibility.minAge': 1 });
JobSchema.index({ 'eligibility.maxAge': 1 });

// ─── Virtuals ──────────────────────────────────────────────────────────────────

/**
 * Human-readable salary range string
 */
JobSchema.virtual('salaryRange').get(function () {
  if (!this.salaryMin && !this.salaryMax) return 'As per norms';
  if (this.salaryMin && this.salaryMax) {
    return `₹${this.salaryMin.toLocaleString('en-IN')} – ₹${this.salaryMax.toLocaleString('en-IN')} / ${this.salaryUnit}`;
  }
  if (this.salaryMin) return `₹${this.salaryMin.toLocaleString('en-IN')}+ / ${this.salaryUnit}`;
  return `Up to ₹${this.salaryMax.toLocaleString('en-IN')} / ${this.salaryUnit}`;
});

/**
 * Whether the application window is still open
 */
JobSchema.virtual('isApplicationOpen').get(function () {
  if (!this.importantDates) return false;
  const now = new Date();
  const { applicationStart, applicationEnd } = this.importantDates;
  if (applicationStart && now < applicationStart) return false;
  if (applicationEnd && now > applicationEnd) return false;
  return true;
});

/**
 * Days remaining until application deadline
 */
JobSchema.virtual('daysUntilDeadline').get(function () {
  if (!this.importantDates?.applicationEnd) return null;
  const diff = this.importantDates.applicationEnd - new Date();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
});

// ─── Pre-save Hooks ────────────────────────────────────────────────────────────

/**
 * Auto-generate slug from title if not provided.
 * Ensures uniqueness by appending a timestamp suffix on collision.
 */
JobSchema.pre('save', async function (next) {
  // Only regenerate slug when title changes or slug is missing
  if (!this.isModified('title') && this.slug) return next();

  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true,       // removes special characters
    replacement: '-',
    trim: true,
  });

  // Check for slug collision
  let slug = baseSlug;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose.model('Job').findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;

  // Auto-generate SEO meta if not provided
  if (this.seo && !this.seo.metaTitle) {
    this.seo.metaTitle = `${this.title} ${new Date().getFullYear()} | SarkariSetu`;
  }

  if (this.seo && !this.seo.metaDescription) {
    this.seo.metaDescription = this.shortDescription.substring(0, 155);
  }

  // Auto-generate JSON-LD schema markup for the job posting
  if (this.seo && !this.seo.schemaMarkup) {
    this.seo.schemaMarkup = buildJobSchema(this);
  }

  // Set publishedAt when first published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

/**
 * Update publishedAt when status changes to 'published'
 */
JobSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update?.status === 'published' || update?.$set?.status === 'published') {
    this.set({ publishedAt: new Date() });
  }
  next();
});

// ─── Static Methods ────────────────────────────────────────────────────────────

/**
 * Find trending jobs by trendingScore
 */
JobSchema.statics.findTrending = function (limit = 10) {
  return this.find({
    status: 'published',
  })
    .sort({ trendingScore: -1, publishedAt: -1 })
    .limit(limit)
    .select('title slug organization state jobType qualification vacancy.total importantDates.applicationEnd featuredImage seo.metaDescription viewCount isTrending trendingScore');
};

/**
 * Recalculate trending score for a job
 * Formula: (Views * 1 + Downloads * 5 + Bookmarks * 10 + Shares * 2) / (Hours_Since_Published + 2)^1.5
 */
JobSchema.methods.calculateTrendingScore = function () {
  const views = this.viewCount || 0;
  const downloads = (this.admitCardDownloadCount || 0) + (this.resultDownloadCount || 0);
  const bookmarks = this.bookmarkCount || 0;
  const shares = this.shareCount || 0;

  const publishedAt = this.publishedAt || this.createdAt;
  const hoursSincePublished = Math.max(0, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60));

  // The denominator adds 2 to avoid division by zero and dampen initial burst
  // The exponent 1.5 is the gravity factor (higher = faster decay)
  const score = (views * 1 + downloads * 5 + bookmarks * 10 + shares * 2) / Math.pow(hoursSincePublished + 2, 1.5);

  this.trendingScore = score;
  return score;
};

/**
 * Increment view count atomically and recalculate trendingScore
 */
JobSchema.statics.incrementViews = async function (id) {
  const job = await this.findById(id);
  if (job) {
    job.viewCount += 1;
    job.calculateTrendingScore();
    await job.save({ validateBeforeSave: false });
  }
  return job;
};

/**
 * Increment download count and recalculate trendingScore
 */
JobSchema.statics.incrementDownload = async function (id, type) {
  const updateField = type === 'admitCard' ? 'admitCardDownloadCount' : 'resultDownloadCount';
  const job = await this.findById(id);
  if (job) {
    job[updateField] += 1;
    job.calculateTrendingScore();
    await job.save({ validateBeforeSave: false });
  }
  return job;
};

// ─── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Regenerate slug (useful when title is updated via $set)
 */
JobSchema.methods.regenerateSlug = async function () {
  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await mongoose.model('Job').findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  this.slug = slug;
  return slug;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build JSON-LD schema.org JobPosting markup
 * @param {Object} job - Mongoose job document
 */
function buildJobSchema(job) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.shortDescription,
    identifier: {
      '@type': 'PropertyValue',
      name: job.organization,
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organization,
      sameAs: job.officialWebsite || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: job.state,
        addressCountry: 'IN',
      },
    },
    employmentType: 'FULL_TIME',
    datePosted: job.publishedAt || new Date(),
    validThrough: job.importantDates?.applicationEnd || undefined,
  };

  if (job.salaryMin || job.salaryMax) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin || undefined,
        maxValue: job.salaryMax || undefined,
        unitText: job.salaryUnit === 'monthly' ? 'MONTH' : 'YEAR',
      },
    };
  }

  return schema;
}

module.exports = mongoose.model('Job', JobSchema);
