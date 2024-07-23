const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const model = require("./model.js");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();


const upload = multer({ dest: 'uploads/' });


const port = 5000;


app.post('/generate-image', upload.single('image'), async (req, res) => {
 const { prompt } = req.body;
  if (!req.file) {
   return res.status(400).json({ error: 'No image file uploaded' });
 }
  const imagePath = req.file.path;
  console.log('Received prompt:', prompt);
 console.log('Image path:', imagePath);
  try {
   const output = await model(prompt, imagePath);
   res.json({ message: 'Image generated', imageUrl: output[0] });
 } catch (error) {
   console.error('Error generating image:', error);
   res.status(500).json({ error: 'Failed to generate image' });
 }
});


app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});
