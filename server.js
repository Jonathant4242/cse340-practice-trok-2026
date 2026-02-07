// Import express using ESM syntax
import express from "express";

// ESM replacements for __dirname / __filename
import { fileURLToPath } from "url";
import path from "path";


// Create an instance of an Express application
const app = express();

// Recreate __filename and __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure Express middleware
 **/

//Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));


// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find templates
app.set("views", path.join(__dirname, "src/views"));

// Define the environment mode
const NODE_ENV = process.env.NODE_ENV || "production";


// Define the port number
const PORT = process.env.PORT || 3000;

// Course data
const courses = {
  CS121: {
    id: "CS121",
    title: "Introduction to Programming",
    description:
      "Learn programming fundamentals using JavaScript and basic web development concepts.",
    credits: 3,
    sections: [
      { time: "9:00 AM", room: "STC 392", professor: "Brother Jack" },
      { time: "2:00 PM", room: "STC 394", professor: "Sister Enkey" },
      { time: "11:00 AM", room: "STC 390", professor: "Brother Keers" },
    ],
  },
  MATH110: {
    id: "MATH110",
    title: "College Algebra",
    description:
      "Fundamental algebraic concepts including functions, graphing, and problem solving.",
    credits: 4,
    sections: [
      { time: "8:00 AM", room: "MC 301", professor: "Sister Anderson" },
      { time: "1:00 PM", room: "MC 305", professor: "Brother Miller" },
      { time: "3:00 PM", room: "MC 307", professor: "Brother Thompson" },
    ],
  },
  ENG101: {
    id: "ENG101",
    title: "Academic Writing",
    description:
      "Develop writing skills for academic and professional communication.",
    credits: 3,
    sections: [
      { time: "10:00 AM", room: "GEB 201", professor: "Sister Anderson" },
      { time: "12:00 PM", room: "GEB 205", professor: "Brother Davis" },
      { time: "4:00 PM", room: "GEB 203", professor: "Sister Enkey" },
    ],
  },
};

/**
 * Global template variables middleware
 * 
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to the next middleware or route handler
    next();
});


/**
 * Routes
 **/


app.get("/", (req, res) => {
    const title = "Welcome Home";
    res.render("home", { title });
});

app.get("/about", (req, res) => {
    const title = "About Me";
    res.render("about", { title });
});


app.get("/products", (req, res) => {
    const title = "Our Products";
    res.render("products", { title });
});


app.get("/student", (req, res) => {
    const title = "Student Information";

    const student = {
        name: "Jane Doe",
        id: "S123456",
        email: "jane.doe@example.com",
        address: "123 Main St, Rexburg, ID",
    };

    res.render("student", { title, student });
});

// Course catalog list page
app.get("/catalog", (req, res) => {
  res.render("catalog", {
    title: "Course Catalog",
    courses: courses,
  });
});

// Course detail page with route parameter + sorting
app.get("/catalog/:courseId", (req, res, next) => {
  const courseId = req.params.courseId;
  const course = courses[courseId];

  // Handle course not found
  if (!course) {
    const err = new Error(`Course ${courseId} not found`);
    err.status = 404;
    return next(err);
  }

  // Query param sorting (default: time)
  const sortBy = req.query.sort || "time";
  const sortedSections = [...course.sections];

  switch (sortBy) {
    case "professor":
      sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
      break;
    case "room":
      sortedSections.sort((a, b) => a.room.localeCompare(b.room));
      break;
    case "time":
    default:
      // keep original order
      break;
  }

  console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

  res.render("course-detail", {
    title: `${course.id} - ${course.title}`,
    course: { ...course, sections: sortedSections },
    currentSort: sortBy,
  });
});

// Route to intentionally trigger a 500 error for testing
app.get("/test-error", (req, res) => {
  throw new Error("Test 500 error");
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Prevent infinite loops: if a response has already been sent
  if (res.headersSent || res.finished) {
    return next(err);
  }

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // Error logging (only log server errors 500+)
  if (status >= 500) {
    console.error(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${status} - ${req.headers["user-agent"]}`
    );
    console.error(err.stack || err);
  }

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: NODE_ENV === "production" ? "An error occurred" : err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
    NODE_ENV, // WebSocket check needs this and its convenient to pass along
  };

  // Render the appropriate error template with fallback
  try {
    res.status(status).render(`errors/${template}`, context);
  } catch (renderErr) {
    // If rendering fails, send error page
    if (!res.headersSent) {
      res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

// WebSocket server for live reloading
if (NODE_ENV.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(PORT) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT} (${NODE_ENV})`);
});