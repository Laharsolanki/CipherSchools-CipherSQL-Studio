const mongoose = require('mongoose');
const { Pool } = require('pg');
const Assignment = require('./models/Assignment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersql-studio';
const PG_URI = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ciphersql';

const pool = new Pool({ connectionString: PG_URI });

const sampleAssignments = [
    {
        title: "Basic Select",
        description: "Learn how to retrieve data from a table.",
        difficulty: "Easy",
        question: "Write a query to select all columns and rows from the 'employees' table.",
        schemaText: "CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(100), department VARCHAR(50), salary INT);",
        sampleData: "1 | John Doe | Engineering | 80000\n2 | Jane Smith | HR | 60000\n3 | Bob Johnson | Sales | 55000",
        setupQuery: `
      DROP TABLE IF EXISTS employees;
      CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(100), department VARCHAR(50), salary INT);
      INSERT INTO employees (name, department, salary) VALUES ('John Doe', 'Engineering', 80000), ('Jane Smith', 'HR', 60000), ('Bob Johnson', 'Sales', 55000);
    `
    },
    {
        title: "Filtering with WHERE",
        description: "Retrieve specific data based on conditions.",
        difficulty: "Medium",
        question: "Write a query to find the names of all employees in the 'Engineering' department with a salary greater than 70000.",
        schemaText: "CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(100), department VARCHAR(50), salary INT);",
        sampleData: "1 | John Doe | Engineering | 80000\n2 | Jane Smith | HR | 60000\n3 | Bob Johnson | Sales | 55000",
        setupQuery: `
      DELETE FROM employees;
      INSERT INTO employees (name, department, salary) VALUES ('John Doe', 'Engineering', 80000), ('Jane Smith', 'HR', 60000), ('Bob Johnson', 'Sales', 55000), ('Alice Williams', 'Engineering', 75000);
    `
    }
];

async function seedDatabase(mongooseInstance, poolInstance) {
    try {
        const Assignment = require('./models/Assignment');

        // Clear existing assignments
        await Assignment.deleteMany({});
        console.log('Cleared existing assignments');

        // Insert new logic
        await Assignment.insertMany(sampleAssignments);
        console.log('Inserted sample assignments to MongoDB memory server');

        // 2. Connect PostgreSQL to run setups
        const client = await poolInstance.connect();

        for (const task of sampleAssignments) {
            if (task.setupQuery) {
                await client.query(task.setupQuery);
            }
        }
        client.release();

        console.log('In-memory Database Seeding Complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

module.exports = { seedDatabase, sampleAssignments };
