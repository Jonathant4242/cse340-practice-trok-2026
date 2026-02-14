import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

/**
 * GET /faculty
 * Renders the faculty directory list.
 * Supports optional sorting via query string: /faculty?sort=name|department|title
 */
const facultyListPage = (req, res) => {
  // If no sort is provided, default to sorting by name.
  const sortBy = req.query.sort || "name";

  // Sorted array of faculty members.
  const facultyList = getSortedFaculty(sortBy);

  res.render("faculty/list", {
    title: "Faculty Directory",
    faculty: facultyList,
    currentSort: sortBy,
  });
};

/**
 * GET /faculty/:facultyId
 * Renders an individual faculty profile page.
 */
const facultyDetailPage = (req, res, next) => {
  // Route param comes from the URL: /faculty/brother-jack
  const facultyId = req.params.facultyId;

  // Matching faculty member in the model.
  const facultyMember = getFacultyById(facultyId);

  // 404 to the global error handler.
  if (!facultyMember) {
    const err = new Error(`Faculty member ${facultyId} not found`);
    err.status = 404;
    return next(err);
  }

  // Preserve the list sort in case the detail page wants a "back" link.
  const sortBy = req.query.sort || "name";

  res.render("faculty/detail", {
    title: facultyMember.name,
    faculty: { id: facultyId, ...facultyMember },
    currentSort: sortBy,
  });
};

export { facultyListPage, facultyDetailPage };