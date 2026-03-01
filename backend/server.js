require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database Initialization
const { MongoMemoryServer } = require('mongodb-memory-server');
const { newDb } = require('pg-mem');
const { seedDatabase } = require('./seed');

async function initializeDatabases() {
    try {
        // 1. Start MongoDB In-Memory Server
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log('Connected to In-Memory MongoDB');

        // 2. Start PostgreSQL In-Memory Server
        const memDb = newDb();
        const mockPgPool = memDb.adapters.createPg().Pool;
        global.pgPool = new mockPgPool(); // Expose pool to execute.js
        console.log('Connected to In-Memory PostgreSQL');

        // 3. Auto-seed databases
        await seedDatabase(mongoose, global.pgPool);
    } catch (err) {
        console.error('Failed to initialize in-memory databases:', err);
        process.exit(1);
    }
}

// Call initialization
initializeDatabases();

// Routes
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/hint', require('./routes/hint'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
