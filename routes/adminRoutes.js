const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const Landowner = require('../models/Landowner');
const Project = require('../models/Project');
const path = require('path');

// --- Frontend Route ---
// // Serve the admin dashboard HTML file
// router.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin.html'));
// });


// --- API Routes ---

// API to get all un-matched landowners and all available farmers
router.get('/data-for-matching', async (req, res) => {
    try {
        // Find landowners who are NOT in any existing project
        const activeProjects = await Project.find({}, 'landownerId');
        const matchedLandownerIds = activeProjects.map(p => p.landownerId);

        const landowners = await Landowner.find({ _id: { $nin: matchedLandownerIds } });
        
        // Find farmers who are verified and available (can be enhanced later)
        const farmers = await Farmer.find({ status: 'Verified' }); // Assuming you have a verification flow

        res.status(200).json({ landowners, farmers });
    } catch (err) {
        console.error('Error fetching data for matching:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// API to create a new project (the match)
router.post('/create-project', async (req, res) => {
    try {
        const { landownerId, farmerIds, crop, projectedStartDate } = req.body;

        // Validation
        if (!landownerId || !farmerIds || !farmerIds.length || !crop) {
            return res.status(400).json({ error: 'Missing required fields for project creation.' });
        }

        // Create the new project
        const newProject = new Project({
            landownerId,
            farmerIds,
            projectDetails: {
                crop,
                projectedStartDate
            }
            // You can add assignedBy: req.admin.id here if you have admin auth
        });

        await newProject.save();

        res.status(201).json({ message: 'Project created successfully!', project: newProject });
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

module.exports = router;