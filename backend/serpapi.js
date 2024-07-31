const { getJson } = require("serpapi");

const serpapi = async (link) => {
    getJson({
      engine: "google_lens",
      url: link,
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
        res = json["visual_matches"][10]
        console.log(res);
        return res.thumbnail;
    });
};

module.exports = serpapi;


//convert edited image to image in s3.
//pass s3 image link to serpapi
//return image output

//problem: need image to output from serp's result