const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes.js");
const { initUserTable } = require("./models/user.model.js");
const { aiResponseTable } = require("./models/aiResponses.model.js");
const aiRoutes = require("./routes/ai.routes.js");
const path = require("path");



dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: true,  
  credentials: true 
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use('/api/', aiRoutes);

// Initialize the user table
initUserTable();
// Initialize the ai-response table
aiResponseTable();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
