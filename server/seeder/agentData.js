import mongoose from "mongoose";
import connectDB from "../database.js";
import Agent from "../models/Agent.js";

const seedAgent = async() => {
    try{
        await connectDB();
        await Agent.deleteMany({});

        console.log('Agent collection cleared.')

        const agents = [
            {
                "name": "John Doe",
                "email": "johndoe@example.com",
                "desc": "An experienced pet adoption agent specializing in dog adoptions.",
                "mission": "Helping dogs find loving homes.",
                "address": "123 Pet Lane, Kuala Lumpur, Malaysia",
                "type": "Agent",
                "passno": "A1234567"
              },
              {
                "name": "Happy Tails Shelter",
                "email": "contact@happytailsshelter.org",
                "desc": "A non-profit animal shelter providing care for abandoned pets.",
                "mission": "To give every pet a second chance at a happy life.",
                "address": "456 Shelter Road, Petaling Jaya, Malaysia",
                "type": "Shelter",
                "workingHrs": ["Monday - Friday: 9 AM - 6 PM", "Saturday: 10 AM - 4 PM"]
              }
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
