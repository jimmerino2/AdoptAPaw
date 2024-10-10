import mongoose from "mongoose";
import connectDB from "../database.js";
import Pet from "../models/Pet.js";

const seedPet = async() => {
    try{
        await connectDB();
        await Pet.deleteMany({});

        console.log('Pet collection cleared.')

        const pets = [
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Bella",
              "age": 2,
              "type": "Dog",
              "breed": "Golden Retriever",
              "weight": 25,
              "desc": "A playful and friendly dog.",
              "gender": "Female",
              "coatLength": "Short",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 500
            },
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Max",
              "age": 4,
              "type": "Dog",
              "breed": "German Shepherd",
              "weight": 30,
              "desc": "A loyal companion, loves to run.",
              "gender": "Male",
              "coatLength": "Medium",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 600
            },
            {
              "agentID": "6707deec53a9b693044b49b7",
              "name": "Luna",
              "age": 1,
              "type": "Cat",
              "breed": "Siamese",
              "weight": 10,
              "desc": "A calm and gentle cat.",
              "gender": "Female",
              "coatLength": "Long",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 200
            },
            {
              "agentID": "6707deec53a9b693044b49b7",
              "name": "Charlie",
              "age": 3,
              "type": "Dog",
              "breed": "Labrador",
              "weight": 20,
              "desc": "Loves to play fetch.",
              "gender": "Male",
              "coatLength": "Short",
              "isAdopted": "Yes",
              "isToiletTrained": "Yes",
              "listedPrice": 550
            },
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Lucy",
              "age": 5,
              "type": "Cat",
              "breed": "Persian",
              "weight": 8,
              "desc": "Loves to nap in the sun.",
              "gender": "Female",
              "coatLength": "Short",
              "isAdopted": "No",
              "isToiletTrained": "No",
              "listedPrice": 150
            },
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Rocky",
              "age": 6,
              "type": "Dog",
              "breed": "Rottweiler",
              "weight": 40,
              "desc": "Very energetic and loves the outdoors.",
              "gender": "Male",
              "coatLength": "Medium",
              "isAdopted": "Yes",
              "isToiletTrained": "Yes",
              "listedPrice": 700
            },
            {
              "agentID": "6707deec53a9b693044b49b7",
              "name": "Molly",
              "age": 3,
              "type": "Cat",
              "breed": "Bengal",
              "weight": 7,
              "desc": "Loves to cuddle.",
              "gender": "Female",
              "coatLength": "Long",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 250
            },
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Duke",
              "age": 2,
              "type": "Dog",
              "breed": "Doberman",
              "weight": 35,
              "desc": "Very protective and loyal.",
              "gender": "Male",
              "coatLength": "Short",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 650
            },
            {
              "agentID": "6707deec53a9b693044b49b7",
              "name": "Daisy",
              "age": 1,
              "type": "Cat",
              "breed": "Maine Coon",
              "weight": 9,
              "desc": "Very curious and playful.",
              "gender": "Female",
              "coatLength": "Short",
              "isAdopted": "No",
              "isToiletTrained": "No",
              "listedPrice": 180
            },
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Oscar",
              "age": 4,
              "type": "Dog",
              "breed": "Beagle",
              "weight": 28,
              "desc": "Calm and great with kids.",
              "gender": "Male",
              "coatLength": "Medium",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 500
            },
            {
              "agentID": "6707deec53a9b693044b49b7",
              "name": "Milo",
              "age": 2,
              "type": "Dog",
              "breed": "Cocker Spaniel",
              "weight": 22,
              "desc": "Enjoys running and playing.",
              "gender": "Male",
              "coatLength": "Short",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 520
            },
            {
              "agentID": "6707deec53a9b693044b49b6",
              "name": "Bailey",
              "age": 5,
              "type": "Dog",
              "breed": "Shih Tzu",
              "weight": 15,
              "desc": "Loves attention and cuddles.",
              "gender": "Female",
              "coatLength": "Long",
              "isAdopted": "No",
              "isToiletTrained": "Yes",
              "listedPrice": 400
            }
        ]
          
        await Pet.insertMany(pets);

        console.log("Pets seeded successfully.")

    } catch (error) {
        console.log("Error seeding Pet.")
    } finally {
        mongoose.disconnect();
    }
}

seedPet();
