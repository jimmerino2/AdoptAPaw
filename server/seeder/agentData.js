import mongoose from "mongoose";
import connectDB from "../database.js";
import Agent from "../models/Agent.js";

const seedAgent = async() => {
    try{
        await connectDB();
        await Agent.deleteMany({});

        console.log('Agent collection cleared.')

        const agents = [
            { name: "Alice Smith (test)"},
            { name: "Bob Johnson (test)"},
        ]

        await Agent.insertMany(agents);

        console.log("Agents seeded successfully.")

    } catch (error) {
        console.log("Error seeding Agent.")
    } finally {
        mongoose.disconnect();
    }
}

seedAgent();
