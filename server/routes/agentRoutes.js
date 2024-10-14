import express from "express";
import { getAgentData } from "../controllers/getAgentData.js";

const router = express.Router();

router.get("/getAgentData", getAgentData);

export default router;