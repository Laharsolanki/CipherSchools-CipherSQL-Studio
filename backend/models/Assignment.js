const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    question: {
        type: String,
        required: true
    },
    schemaText: {
        type: String,
        required: true
    },
    sampleData: {
        type: String, // Or JSON, representing the mock data for visual reference
        required: true
    },
    setupQuery: {
        type: String, // Hidden query to set up the Postgres SQL tables for this assignment
        required: false
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
