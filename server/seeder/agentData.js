import mongoose from "mongoose";
import connectDB from "../database.js";
import Agent from "../models/Agent.js";

const seedAgent = async () => {
  try {
    await connectDB();

    await Agent.deleteMany({}); // findOne, findMany, deleteOne, deleteMany

    console.log("agent collection cleared");

    // Seed seeder for the database
    const agents = [
      { name: "Alice Smith" },
      { name: "Bob Johnson" },
      { name: "Charlie Brown" },
      { name: "Diana Lee" },
      { name: "Ethan Hunt" },
    ];

    await Agent.insertMany(agents);

    console.log("Agents seeded successfully");
  } catch (error) {
    console.error("Error seeding agents");
  } finally {
    mongoose.disconnect();
  }
};

seedAgent();
