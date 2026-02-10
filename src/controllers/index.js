

// src/controllers/index.js

// Route handlers for basic pages
const homePage = (req, res) => {
  res.render("home", { title: "Home" });
};

const aboutPage = (req, res) => {
  res.render("about", { title: "About" });
};

const demoPage = (req, res) => {
  res.render("demo", { title: "Middleware Demo Page" });
};

// Route to intentionally trigger a 500 error (for testing your global error handler)
const testErrorPage = (req, res, next) => {
  const err = new Error("This is a test error");
  err.status = 500;
  next(err);
};

export { homePage, aboutPage, demoPage, testErrorPage };