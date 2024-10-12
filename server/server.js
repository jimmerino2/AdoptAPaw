import cors from "cors";
import express from "express";
import connectDB from "./database.js";
import petRoutes from "./routes/petRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/pets", petRoutes);

const port = 5001;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
