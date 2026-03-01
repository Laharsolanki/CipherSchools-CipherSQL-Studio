const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// GET all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find({}, 'title description difficulty');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching assignments' });
    }
});

// GET assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching assignment' });
    }
});

module.exports = router;
