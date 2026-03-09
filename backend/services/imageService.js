const axios = require("axios");

async function fetchRecipeImage(query) {

  const response = await axios.get(
    "https://api.unsplash.com/search/photos",
    {
      params: {
        query: query + " food dish",
        per_page: 5,   // get multiple images
        orientation: "landscape"
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
      }
    }
  );

  const results = response.data.results;

  if (results.length > 0) {

    // pick random image
    const randomIndex = Math.floor(Math.random() * results.length);

    return results[randomIndex].urls.small;
  }

  return "https://via.placeholder.com/300?text=Recipe";
}

module.exports = { fetchRecipeImage };