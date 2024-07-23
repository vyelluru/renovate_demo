const Replicate = require('replicate');
const { readFile } = require("node:fs/promises");
const sharp = require('sharp');


const model = async (prompt, imagePath) => {
   if (!imagePath) {
       throw new Error("Image path is required");
   }


   const api_key = process.env.REPLICATE_API_TOKEN;
  
   const replicate = new Replicate();


   try {
       const imageBuffer = await readFile(imagePath);
      
       const resizedImageBuffer = await sharp(imageBuffer)
           .resize({ width: 1024, withoutEnlargement: true })
           .toBuffer();


       const input = {
           image: resizedImageBuffer,
           prompt: prompt || "",
           negative_prompt: "nude, disfigured, blurry",
           num_inference_steps: 100,
           //guidance_scale: 12,
           image_guidance_scale: 15
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