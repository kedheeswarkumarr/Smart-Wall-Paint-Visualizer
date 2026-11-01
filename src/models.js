const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favoriteColors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }]
}, { timestamps: true });

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hex: { type: String, required: true, uppercase: true, match: /^#[0-9A-F]{6}$/ },
  brand: { type: String, default: 'Custom' },
  finish: { type: String, enum: ['Matte', 'Eggshell', 'Satin', 'Gloss'], default: 'Matte' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }]
}, { timestamps: true });

const patternSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Geometric' },
  imageUrl: { type: String, default: '' },
  scale: { type: Number, min: 0.1, max: 10, default: 1 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My room design', maxlength: 120 },
  imageUrl: { type: String, required: true },
  originalImageUrl: { type: String, default: '' },
  maskData: { type: String, default: '' },
  appliedColor: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
  colorHex: { type: String, default: '#D8CDBB' },
  finish: { type: String, default: 'Matte' },
  pattern: { type: mongoose.Schema.Types.ObjectId, ref: 'Pattern', default: null },
  opacity: { type: Number, min: 0, max: 1, default: 0.55 },
  brightness: { type: Number, min: 0.5, max: 1.5, default: 1 }
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { type: String, enum: ['upload', 'save', 'login', 'download'], required: true },
  detail: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Color: mongoose.model('Color', colorSchema),
  Pattern: mongoose.model('Pattern', patternSchema),
  Project: mongoose.model('Project', projectSchema),
  Activity: mongoose.model('Activity', activitySchema)
};
