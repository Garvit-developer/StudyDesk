const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes.js");
const { initUserTable } = require("./models/user.model.js");
const { aiResponseTable } = require("./models/aiResponses.model.js");
const aiRoutes = require("./routes/ai.routes.js");
const flashcardRoutes = require("./routes/flashcard.routes.js");
const statsRoutes = require("./routes/stats.routes.js");
const quizRoutes = require("./routes/quiz.routes.js");
const { initFlashcardTable } = require("./models/flashcard.model.js");
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
app.use('/api/', flashcardRoutes);
app.use('/api/', statsRoutes);
app.use('/api/', quizRoutes);

// Initialize the user table
initUserTable();
// Initialize the ai-response table
aiResponseTable();
// Initialize the flashcard table
initFlashcardTable();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
