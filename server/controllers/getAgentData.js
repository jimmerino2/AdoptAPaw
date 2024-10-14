import Agent from "../models/Agent.js";

export const getAgentData = async (req, res) => {
    const agentsData = await Agent.find();
    res.status(200).json(agentsData);
}