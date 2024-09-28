const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
 
// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/businessDetailsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Schema
const businessSchema = new mongoose.Schema({
  businessName: String,
  industry: String,
  otherIndustry: String,
  businessDescription: String,
  businessLogo: String, // Path to the uploaded logo
  primaryColor: String,
  secondaryColor: String,
  tertiaryColor: String,
  fontSize: String,
  fontStyle: String,
});

// Create Model
const Business = mongoose.model('Business', businessSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Handle form submissions
app.post('/submit', upload.single('businessLogo'), (req, res) => {
  const { businessName, industry, otherIndustry, businessDescription, primaryColor, secondaryColor, tertiaryColor, fontSize, fontStyle } = req.body;

  const newBusiness = new Business({
    businessName,
    industry,
    otherIndustry: industry === 'other' ? otherIndustry : '',
    businessDescription,
    businessLogo: req.file ? req.file.path : '',
    primaryColor,
    secondaryColor,
    tertiaryColor,
    fontSize,
    fontStyle,
  });

  // Save data to the database
  newBusiness
    .save()
    .then(() => res.json({ message: 'Business details saved successfully' }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Serve the uploaded files
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
