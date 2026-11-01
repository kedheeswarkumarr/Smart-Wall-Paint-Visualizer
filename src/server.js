require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User, Color, Pattern, Project, Activity } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map(x => x.trim()) : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(uploadDir, { maxAge: '1d' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${require('crypto').randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const valid = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(valid ? null : new Error('Only JPG, PNG or WEBP images are allowed.'), valid);
  }
});

function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Please sign in.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: 'Session expired. Please sign in again.' }); }
}
function admin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
}
function sessionFor(user) {
  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}
async function recordActivity(user, type, detail = '') {
  try { await Activity.create({ user: user?.id || user?._id || null, type, detail }); } catch (e) { console.warn('Activity record skipped:', e.message); }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Smart Wall Paint Visualizer API' }));

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return res.status(400).json({ message: 'Enter a name, valid email and password of at least 8 characters.' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered.' });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    await recordActivity(user, 'login', 'Account registered');
    res.status(201).json(sessionFor(user));
  } catch (e) { res.status(500).json({ message: 'Could not create account.' }); }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(String(req.body.password || ''), user.passwordHash)) return res.status(401).json({ message: 'Email or password is incorrect.' });
    await recordActivity(user, 'login');
    res.json(sessionFor(user));
  } catch { res.status(500).json({ message: 'Could not sign in.' }); }
});
app.get('/api/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email role createdAt');
  if (!user) return res.status(404).json({ message: 'Account not found.' });
  res.json(user);
});

// Paint colour catalogue
app.get('/api/colors', async (_req, res) => res.json(await Color.find().sort({ category: 1, name: 1 })));
app.post('/api/colors', auth, admin, async (req, res) => {
  try { res.status(201).json(await Color.create(req.body)); }
  catch { res.status(400).json({ message: 'Check the colour name and HEX value (example #AABBCC).' }); }
});
app.put('/api/colors/:id', auth, admin, async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!color) return res.status(404).json({ message: 'Colour not found.' });
    res.json(color);
  } catch { res.status(400).json({ message: 'Invalid colour details.' }); }
});
app.delete('/api/colors/:id', auth, admin, async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  if (!color) return res.status(404).json({ message: 'Colour not found.' });
  res.json({ message: 'Colour removed.' });
});

// Pattern library and administration
app.get('/api/patterns', async (_req, res) => res.json(await Pattern.find({ active: true }).sort({ category: 1, name: 1 })));
app.get('/api/admin/patterns', auth, admin, async (_req, res) => res.json(await Pattern.find().sort({ createdAt: -1 })));
app.post('/api/admin/patterns', auth, admin, async (req, res) => {
  try { res.status(201).json(await Pattern.create(req.body)); }
  catch { res.status(400).json({ message: 'Pattern name is required.' }); }
});
app.put('/api/admin/patterns/:id', auth, admin, async (req, res) => {
  try {
    const pattern = await Pattern.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pattern) return res.status(404).json({ message: 'Pattern not found.' });
    res.json(pattern);
  } catch { res.status(400).json({ message: 'Invalid pattern details.' }); }
});
app.delete('/api/admin/patterns/:id', auth, admin, async (req, res) => {
  const pattern = await Pattern.findByIdAndDelete(req.params.id);
  if (!pattern) return res.status(404).json({ message: 'Pattern not found.' });
  res.json({ message: 'Pattern deleted.' });
});

// Room images and saved designs
app.post('/api/projects/upload', auth, upload.single('room'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose a room photo.' });
  const imageUrl = `/uploads/${req.file.filename}`;
  await recordActivity(req.user, 'upload', req.file.originalname);
  res.status(201).json({ imageUrl });
});
app.post('/api/projects', auth, async (req, res) => {
  try {
    const payload = { ...req.body, user: req.user.id };
    if (!payload.imageUrl) return res.status(400).json({ message: 'A preview image is required.' });
    const project = await Project.create(payload);
    await recordActivity(req.user, 'save', project.title);
    res.status(201).json(project);
  } catch { res.status(400).json({ message: 'Could not save design. Check the project details.' }); }
});
app.get('/api/projects', auth, async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
  res.json(await Project.find(filter).populate('user', 'name email').populate('pattern', 'name category').sort({ updatedAt: -1 }));
});
app.get('/api/projects/:id', auth, async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };
  const project = await Project.findOne(filter);
  if (!project) return res.status(404).json({ message: 'Design not found.' });
  res.json(project);
});
app.put('/api/projects/:id', auth, async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };
  try {
    const allowed = ['title', 'imageUrl', 'originalImageUrl', 'maskData', 'appliedColor', 'colorHex', 'finish', 'pattern', 'opacity', 'brightness'];
    const changes = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
    const project = await Project.findOneAndUpdate(filter, changes, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Design not found.' });
    res.json(project);
  } catch { res.status(400).json({ message: 'Could not update design.' }); }
});
app.delete('/api/projects/:id', auth, async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };
  const project = await Project.findOneAndDelete(filter);
  if (!project) return res.status(404).json({ message: 'Design not found.' });
  res.json({ message: 'Design deleted.' });
});

// Admin operations and KPI summaries
app.get('/api/admin/stats', auth, admin, async (_req, res) => {
  const [users, projects, colors, patterns, uploads, saves, recentActivity] = await Promise.all([
    User.countDocuments(), Project.countDocuments(), Color.countDocuments(), Pattern.countDocuments(),
    Activity.countDocuments({ type: 'upload' }), Activity.countDocuments({ type: 'save' }),
    Activity.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(12)
  ]);
  res.json({ users, projects, colors, patterns, uploads, saves, recentActivity });
});
app.get('/api/admin/users', auth, admin, async (_req, res) => res.json(await User.find().select('name email role createdAt').sort({ createdAt: -1 })));
app.patch('/api/admin/users/:id/role', auth, admin, async (req, res) => {
  if (!['user', 'admin'].includes(req.body.role)) return res.status(400).json({ message: 'Role must be user or admin.' });
  if (String(req.user.id) === String(req.params.id) && req.body.role !== 'admin') return res.status(400).json({ message: 'You cannot remove your own admin role.' });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('name email role');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});
app.delete('/api/admin/users/:id', auth, admin, async (req, res) => {
  if (String(req.user.id) === String(req.params.id)) return res.status(400).json({ message: 'You cannot delete your own account here.' });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  await Project.deleteMany({ user: req.params.id });
  res.json({ message: 'User and their saved projects deleted.' });
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  const status = err instanceof multer.MulterError ? 400 : 500;
  res.status(status).json({ message: err.message || 'Server error.' });
});

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters. Set it in server/.env.');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Set it in server/.env.');
  await mongoose.connect(process.env.MONGODB_URI);
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    if (!await User.findOne({ email })) {
      await User.create({ name: process.env.ADMIN_NAME || 'HueRoom Admin', email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' });
      console.log(`Admin account created for ${email}`);
    }
  }
  if (await Color.countDocuments() === 0) await Color.insertMany([
    { name: 'Warm White', hex: '#F3EFE6', category: 'Neutral', finish: 'Matte' },
    { name: 'Ocean Breeze', hex: '#79A9B8', category: 'Blue', finish: 'Eggshell' },
    { name: 'Sage Garden', hex: '#9BAE91', category: 'Green', finish: 'Matte' },
    { name: 'Soft Terracotta', hex: '#C77E65', category: 'Earthy', finish: 'Matte' },
    { name: 'Cloud Grey', hex: '#C9CCCB', category: 'Neutral', finish: 'Satin' },
    { name: 'Midnight Blue', hex: '#344B68', category: 'Blue', finish: 'Eggshell' },
    { name: 'Buttercream', hex: '#E9D8A6', category: 'Warm', finish: 'Matte' },
    { name: 'Olive Branch', hex: '#737B55', category: 'Green', finish: 'Matte' }
  ]);
  if (await Pattern.countDocuments() === 0) await Pattern.insertMany([
    { name: 'Soft geometric', description: 'Subtle geometric accent-wall inspiration.', category: 'Geometric' },
    { name: 'Botanical accent', description: 'Leaf-inspired decorative wall concept.', category: 'Floral' },
    { name: 'Linen texture', description: 'Soft fabric-like texture inspiration.', category: 'Texture' }
  ]);
  app.listen(PORT, () => console.log(`Smart Wall Paint Visualizer API running at http://localhost:${PORT}`));
}
start().catch(error => { console.error(error); process.exit(1); });
