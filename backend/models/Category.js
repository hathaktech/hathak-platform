import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Hierarchy
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Media
  image: {
    url: String,
    alt: String
  },
  icon: {
    name: String,
    color: String
  },
  
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  
  // Display Settings
  displayOrder: {
    type: Number,
    default: 0
  },
  showInMenu: {
    type: Boolean,
    default: true
  },
  showInFilters: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  analytics: {
    productCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 }
  },
  
  // Attributes for filtering
  attributes: [{
    name: String,
    type: { type: String, enum: ['text', 'number', 'boolean', 'select', 'multiselect', 'range'] },
    options: [String], // for select/multiselect
    required: { type: Boolean, default: false },
    filterable: { type: Boolean, default: true },
    searchable: { type: Boolean, default: false }
  }],
  
  // Commission settings
  commission: {
    rate: { type: Number, default: 10 }, // percentage
    fixed: { type: Number, default: 0 } // fixed amount
  }
}, {
  timestamps: true,
  collection: 'categories'
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, status: 1 });
categorySchema.index({ level: 1, displayOrder: 1 });
categorySchema.index({ name: 'text', description: 'text' });

// Virtual for children
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for full path name
categorySchema.virtual('fullPath').get(function() {
  return this.path.map(p => p.name).join(' > ') + (this.name ? ' > ' + this.name : '');
});

// Method to get all descendants
categorySchema.methods.getDescendants = async function() {
  const children = await this.constructor.find({ parent: this._id });
  let descendants = [...children];
  
  for (const child of children) {
    const childDescendants = await child.getDescendants();
    descendants = descendants.concat(childDescendants);
  }
  
  return descendants;
};

// Method to get all ancestors
categorySchema.methods.getAncestors = async function() {
  const ancestors = [];
  let current = this.parent;
  
  while (current) {
    const parent = await this.constructor.findById(current);
    if (parent) {
      ancestors.unshift(parent);
      current = parent.parent;
    } else {
      break;
    }
  }
  
  return ancestors;
};

// Method to update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    category: this._id, 
    status: 'active' 
  });
  this.analytics.productCount = count;
  return this.save();
};

// Pre-save middleware to set level and path
categorySchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('parent')) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.path = [...parent.path, parent._id];
      }
    } else {
      this.level = 0;
      this.path = [];
    }
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
