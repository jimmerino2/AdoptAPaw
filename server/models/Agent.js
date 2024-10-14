import mongoose from "mongoose"; 

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    desc: { type: String, required: true},
    mission: {type: String, required: true},
    address: {type: String, required: true},
    type: {type: String, required: true},
    // Agent required
    passno: { type: String, required: false},
    // Shelter required
    workingHrs: { type: Array, required: false}
})

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;