const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const model = require("./model.js");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const serpapi = require("./serpapi.js");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const linkPreview = require('./linkPreview.js');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

const port = 5000;

// Configure AWS
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'renovate-ai',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});


app.post('/generate-image', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
   if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const imagePath = req.file.location;
  console.log('Received prompt:', prompt);
  console.log('User Input in S3:', imagePath);
   try {
    let output = await model(prompt, imagePath);
    output = output[0]
    console.log('Output of Diffusion Model:', output)

    const serpapiOutput = await serpapi(output);
    console.log('Output of SerpAPI Lens: ', serpapiOutput);
    let websitePreviewOutputArray = serpapiOutput;

    let linkedPreviewOutputArray = []
    for (link of websitePreviewOutputArray) {
      const linkPreviewOutput = await linkPreview(link);
      linkedPreviewOutputArray.push(linkPreviewOutput.image)
    }
    console.log('Output of LinkPreview API:', linkedPreviewOutputArray);

    res.json({ message: 'Image generated', imageUrl: output, productArray: linkedPreviewOutputArray, productWebArray: websitePreviewOutputArray});
      
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
 });
 

app.listen(port, () => console.log('Server running'));