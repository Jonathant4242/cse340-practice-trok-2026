/****
 * Quick helper: picks a friendly greeting based on the current time.
 */
const getCurrentGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good Morning!";
  if (currentHour < 18) return "Good Afternoon!";
  return "Good Evening!";
};

/**
 * Global template locals.
 *
 * I use this middleware to stash a few handy values on `res.locals` so any EJS view
 * can use them (or ignore them). Keeps the route handlers cleaner.
 */
const addLocalVariables = (req, res, next) => {
  const now = new Date();

  // Handy for the footer (and anywhere else that needs the year)
  res.locals.currentYear = now.getFullYear();

  // Let templates know what environment we're running in (dev vs production)
  res.locals.NODE_ENV = (process.env.NODE_ENV?.toLowerCase() || "production");

  // Expose query params so views can read things like sorting/filtering
  res.locals.queryParams = { ...req.query };

  // Greeting wrapped in a <p> so templates can drop it in directly
  res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;

  // Randomly pick a theme class for the page
  const themes = ["blue-theme", "green-theme", "red-theme"];
  res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

  next();
};

export { addLocalVariables };