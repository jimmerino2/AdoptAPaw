import cors from "cors";
import express from "express";
import connectDB from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = 5001;

connectDB();

/* ========================= GET PET DATA ======================== */
app.get("/getPetData", async (req, res) => {
  res.status(200).json({ message: "hi" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
