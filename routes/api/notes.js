const express = require("express");
const router = express.Router();
const notesCtrl = require("../../controllers/api/notes");
// require the authorization middleware function
const ensureLoggedIn = require("../../config/ensureLoggedIn");

router.get("/", ensureLoggedIn, notesCtrl.getAllNotes);
router.get("/:id", ensureLoggedIn, notesCtrl.getNote);
router.post("/", ensureLoggedIn, notesCtrl.createNote);
router.put("/:id", ensureLoggedIn, notesCtrl.updateNote);
router.delete("/:id", ensureLoggedIn, notesCtrl.deleteNote);

// Get All Notes
// get "/api/notes"

// Create A Note
// post "/api/notes"

// Get Note by ID
// get "/api/notes/:id"

// Update A Note
// put "/api/notes/:id"

// Delete A Note by ID
// delete "/api/notes/:id"

module.exports = router;
