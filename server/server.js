import cors from "cors";
import express from "express";
import connectDB from "./database.js";
import petRoutes from "./routes/petRoutes.js";
import agentRoutes from "./routes/agentRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use("/pets", petRoutes);
app.use("/agents", agentRoutes);

const port = 5001;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
