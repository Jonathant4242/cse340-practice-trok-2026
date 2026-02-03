// Import express using ESM syntax
import express from 'express';

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

// Access the NAME environment variable
const name = process.env.NAME; 

/**
 * Routes
 **/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/about.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/products.html'));
});

app.get('/new-route', (req, res) => {
    res.send('This is a new route!');
});

// Define the port number the server will listen on
const PORT = 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});