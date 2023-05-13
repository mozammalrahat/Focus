const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://645f7da50aa7bd375fdd15b2--grand-brigadeiros-3c0359.netlify.app/";

module.exports = baseUrl;
