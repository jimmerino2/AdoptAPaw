import mongoose from "mongoose" // Define your schema

const petSchema = new mongoose.Schema({
    agentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    type: { type: Number, required: true },
    breed: { type: Number, required: true },
    weight: { type: Number, required: true },
    desc: { type: String, required: true },
    gender: { type: String, required: true },
    coatLength: { type: String, required: true },
    isAdopted: { type: String, required: true },
    isToiletTrained: { type: String, required: true },
    listedPrice: { type: Number, required: true }
})

const Pet = mongoose.model("Pet", petSchema); // Create a model (table) using schema

export default Pet;