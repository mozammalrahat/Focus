const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://grand-brigadeiros-3c0359.netlify.app";

module.exports = baseUrl;
