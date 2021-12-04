const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://focu-s.herokuapp.com";

export default baseUrl;
