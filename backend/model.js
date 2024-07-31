const Replicate = require('replicate');
const { readFile } = require("node:fs/promises");
const sharp = require('sharp');
const axios = require('axios');

const model = async (prompt, imagePath) => {
   if (!imagePath) {
       throw new Error("Image path is required");
   }


   const api_key = process.env.REPLICATE_API_TOKEN;
  
   const replicate = new Replicate();


   try {
    //    const imageBuffer = await readFile(imagePath);
      
    //    const resizedImageBuffer = await sharp(imageBuffer)
    //         .resize({
    //             fit: sharp.fit.contain,
    //             width: 800
    //         })
    //        .toBuffer();
        let imageBuffer;

        // Check if imagePath is a URL or a local file path
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            // It's a URL, download the image
            const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(response.data, 'binary');
        } else {
            // It's a local file path, read it directly
            imageBuffer = await readFile(imagePath);
        }

        // Detect image format and apply appropriate processing
        let imageSharp = sharp(imageBuffer);
        const metadata = await imageSharp.metadata();
        
        // Determine appropriate resize options
        const resizeOptions = {
            fit: sharp.fit.contain,
            width: 800
        };

        // Adjust resize options based on original image dimensions if needed
        if (metadata.width > 800) {
            resizeOptions.width = 800;
        } else {
            resizeOptions.width = metadata.width;
        }

        // Apply resizing and compression based on detected image format
        if (metadata.format === 'jpeg') {
            imageSharp = imageSharp.jpeg({ quality: 70 });
        } else if (metadata.format === 'png') {
            imageSharp = imageSharp.png({ compressionLevel: 9 });
        } else if (metadata.format === 'webp') {
            imageSharp = imageSharp.webp({ quality: 80 });
        } else {
            imageSharp = imageSharp.jpeg({ quality: 70 });
        }

        // Resize and compress the image
        const resizedImageBuffer = await imageSharp.resize(resizeOptions).toBuffer();


       const input = {
           image: resizedImageBuffer,
           prompt: prompt || "",
           scheduler: "DDIM",
           negative_prompt: "nude, disfigured, blurry",
           num_inference_steps: 25,
           //guidance_scale: 12,
           //image_guidance_scale: 12
       };


       const output = await replicate.run(
           "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
           { input }
       );
       return output;
   } catch (error) {
       console.error('Error in model function:', error);
       throw error;
   }
}


module.exports = model;