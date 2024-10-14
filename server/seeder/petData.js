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
            "agentID": "670c96688142bf17ef246a2a",
            "name": "Bella",
            "age": 2,
            "type": "Dog",
            "breed": "Golden Retriever",
            "weight": 25,
            "desc": "A playful and friendly dog.",
            "gender": "Female",
            "personality": ["playful", "friendly", "energetic"],
            "location": "Kuala Lumpur",
            "coatLength": 5,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 500
          },
          {
            "agentID": "670c96688142bf17ef246a2b",
            "name": "Max",
            "age": 4,
            "type": "Dog",
            "breed": "German Shepherd",
            "weight": 30,
            "desc": "A loyal companion, loves to run.",
            "gender": "Male",
            "personality": ["loyal", "protective", "active"],
            "location": "Petaling Jaya",
            "coatLength": 8,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 600
          },
          {
            "agentID": "670c96688142bf17ef246a2a",
            "name": "Luna",
            "age": 1,
            "type": "Cat",
            "breed": "Siamese",
            "weight": 10,
            "desc": "A calm and gentle cat.",
            "gender": "Female",
            "personality": ["calm", "affectionate", "quiet"],
            "location": "George Town",
            "coatLength": 10,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 200
          },
          {
            "agentID": "670c96688142bf17ef246a2b",
            "name": "Charlie",
            "age": 3,
            "type": "Dog",
            "breed": "Labrador",
            "weight": 20,
            "desc": "Loves to play fetch.",
            "gender": "Male",
            "personality": ["playful", "friendly", "energetic"],
            "location": "Ipoh",
            "coatLength": 5,
            "isAdopted": "Yes",
            "isToiletTrained": "Yes",
            "listedPrice": 550
          },
          {
            "agentID": "670c96688142bf17ef246a2a",
            "name": "Lucy",
            "age": 5,
            "type": "Cat",
            "breed": "Persian",
            "weight": 8,
            "desc": "Loves to nap in the sun.",
            "gender": "Female",
            "personality": ["relaxed", "lazy", "loving"],
            "location": "Kota Kinabalu",
            "coatLength": 5,
            "isAdopted": "No",
            "isToiletTrained": "No",
            "listedPrice": 150
          },
          {
            "agentID": "670c96688142bf17ef246a2b",
            "name": "Rocky",
            "age": 6,
            "type": "Dog",
            "breed": "Rottweiler",
            "weight": 40,
            "desc": "Very energetic and loves the outdoors.",
            "gender": "Male",
            "personality": ["energetic", "strong", "loyal"],
            "location": "Shah Alam",
            "coatLength": 7,
            "isAdopted": "Yes",
            "isToiletTrained": "Yes",
            "listedPrice": 700
          },
          {
            "agentID": "670c96688142bf17ef246a2a",
            "name": "Molly",
            "age": 3,
            "type": "Cat",
            "breed": "Bengal",
            "weight": 7,
            "desc": "Loves to cuddle.",
            "gender": "Female",
            "personality": ["cuddly", "playful", "active"],
            "location": "Johor Bahru",
            "coatLength": 10,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 250
          },
          {
            "agentID": "670c96688142bf17ef246a2b",
            "name": "Duke",
            "age": 2,
            "type": "Dog",
            "breed": "Doberman",
            "weight": 35,
            "desc": "Very protective and loyal.",
            "gender": "Male",
            "personality": ["protective", "loyal", "alert"],
            "location": "Seremban",
            "coatLength": 5,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 650
          },
          {
            "agentID": "670c96688142bf17ef246a2a",
            "name": "Daisy",
            "age": 1,
            "type": "Cat",
            "breed": "Maine Coon",
            "weight": 9,
            "desc": "Very curious and playful.",
            "gender": "Female",
            "personality": ["curious", "playful", "active"],
            "location": "Kuching",
            "coatLength": 5,
            "isAdopted": "No",
            "isToiletTrained": "No",
            "listedPrice": 180
          },
          {
            "agentID": "670c96688142bf17ef246a2b",
            "name": "Oscar",
            "age": 4,
            "type": "Dog",
            "breed": "Beagle",
            "weight": 28,
            "desc": "Calm and great with kids.",
            "gender": "Male",
            "personality": ["calm", "friendly", "gentle"],
            "location": "Melaka",
            "coatLength": 7,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 500
          },
          {
            "agentID": "670c96688142bf17ef246a2a",
            "name": "Milo",
            "age": 2,
            "type": "Dog",
            "breed": "Cocker Spaniel",
            "weight": 22,
            "desc": "Enjoys running and playing.",
            "gender": "Male",
            "personality": ["energetic", "playful", "friendly"],
            "location": "Alor Setar",
            "coatLength": 5,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 520
          },
          {
            "agentID": "670c96688142bf17ef246a2b",
            "name": "Bailey",
            "age": 5,
            "type": "Dog",
            "breed": "Shih Tzu",
            "weight": 15,
            "desc": "Loves attention and cuddles.",
            "gender": "Female",
            "personality": ["affectionate", "cuddly", "friendly"],
            "location": "Kuala Terengganu",
            "coatLength": 12,
            "isAdopted": "No",
            "isToiletTrained": "Yes",
            "listedPrice": 400
          }
        ];
        
        await Pet.insertMany(pets);

        console.log("Pets seeded successfully.")

    } catch (error) {
        console.log("Error seeding Pet.")
    } finally {
        mongoose.disconnect();
    }
}

seedPet();
