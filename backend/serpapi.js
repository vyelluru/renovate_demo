const { getJson } = require("serpapi");

const serpapi = async (link) => {
  return new Promise((resolve, reject) => {
    getJson(
      {
        engine: "google_lens",
        url: link,
        api_key: process.env.SERPAPI_KEY,
      },
      (json) => {
        if (json.error) {
          console.error("SerpAPI Error:", json.error);
        }

        const result = [json.visual_matches[0].link, json.visual_matches[1].link, json.visual_matches[2].link];

        if (result) {
          resolve(result);
        } else {
          reject("No visual match found in SerpAPI");
        }
      }
    );
  });
};

module.exports = serpapi;



//convert edited image to image in s3.
//pass s3 image link to serpapi
//return image output

//problem: need image to output from serp's result