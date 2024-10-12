import express from "express";
import { getPetData } from "../controllers/getPetData.js";

const router = express.Router();

router.get("/getPetData", getPetData);

export default router;