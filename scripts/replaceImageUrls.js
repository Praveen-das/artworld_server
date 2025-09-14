// Save this as replaceImageUrls.js in your scripts folder

const fs = require("fs");

// Load images.json and dummy_products.json
const images = JSON.parse(fs.readFileSync("./images.json", "utf8"));
const products = JSON.parse(fs.readFileSync("./dummy_products.json", "utf8"));

// Extract all URLs from images.json
const imageUrls = images.map(({ url, fileId, name }) => ({ url, fileId, name })).filter(Boolean);

// Helper to get a random URL
function getRandomUrl() {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

// Replace every images.url in dummy_products.json
products.forEach((product) => {
  if (Array.isArray(product.images)) {
    product.images = product.images.map((img) => getRandomUrl());
  }
});

// Save the updated products back to dummy_products.json
fs.writeFileSync("./dummy_products.json", JSON.stringify(products, null, 2), "utf8");

console.log("All image URLs replaced with random URLs from images.json!");
