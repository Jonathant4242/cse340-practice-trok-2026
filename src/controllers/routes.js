import { Router } from "express";

import { addDemoHeaders } from "../middleware/demo/headers.js";

import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";

import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";

const router = Router();

// Home + basic pages
router.get("/", homePage);
router.get("/about", aboutPage);

// Course catalog
router.get("/catalog", catalogPage);
router.get("/catalog/:courseId", courseDetailPage);

// Faculty directory
router.get("/faculty", facultyListPage);
router.get("/faculty/:facultyId", facultyDetailPage);

// Demo page (route-specific middleware)
router.get("/demo", addDemoHeaders, demoPage);

// Test route for 500 errors
router.get("/test-error", testErrorPage);

export default router;