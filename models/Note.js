// REQUIRE MONGOOSE * ============================================= *
const mongoose = require("mongoose");

// REFERENCE TO SCHEMA CONSTRUCTOR * ============================== *
const Schema = mongoose.Schema;

// CREATE NOTE SCHEMA OBJECT * ==================================== *
const NoteSchema = new Schema({
    body: String
});

// CREATE MODEL FOR SCHEMA * ====================================== *
const Note = mongoose.model("Note", NoteSchema);

// EXPORT MODEL * ================================================= *
module.exports = Note;