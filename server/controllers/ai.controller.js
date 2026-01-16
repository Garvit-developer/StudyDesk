const bossAgent = require('../config/aiAgent.js');

const {  getUserAIResponses, deleteUserAIResponse ,deleteAllUserResponses} = require('../models/aiResponses.model.js');





//ask-ai
const askAI = async (req, res) => {
  try {
    const { question, grade, subjectUser, explanation, steps } = req.body;


    // Validate required input
    if (!question || !grade || !subjectUser) {
      return res.status(400).json({
        success: false,
        error: "'question', 'grade', and 'subjectUser' are required fields",
      });
    }

    if (typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Question must be a non-empty string",
      });
    }

    // Validate boolean parameters (set defaults if not provided)
    const explanationFlag = typeof explanation === 'boolean' ? explanation : false;
    const stepsFlag = typeof steps === 'boolean' ? steps : false;

    // Process the question with explanation and steps flags
    const result = await bossAgent.handleQuestion(
      question.trim(),
      grade,
      subjectUser,
      explanationFlag,
      stepsFlag,
      req.user ? req.user.id : null
    );

    res.json(result);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error occurred while processing your question",
    });
  }
}


//Get All Responses with Search
const getSavedResponses = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  try {
    const result = await getUserAIResponses(userId, page, limit, search);

    const parsedResponses = result.responses.map(r => ({
      ...r,
      steps: JSON.parse(r.steps || '[]'),
    }));

    const totalPages = Math.ceil(result.total / limit);

    res.status(200).json({
      totalResults: result.total,
      page,
      limit,
      totalPages,
      responses: parsedResponses,
    });
  } catch (err) {
    console.error('[Get Responses Error]', err.message);
    res.status(500).json({ message: 'Database error' });
  }
};



//Delete singe response
const deleteResponse = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await deleteUserAIResponse(userId, id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Response not found or already deleted' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('[Delete Response Error]', err.message);
    res.status(500).json({ message: 'Database error' });
  }
};

//All response delelte perticular user
const deleteAllResponses = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await deleteAllUserResponses(userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No responses found to delete' });
    }

    res.status(200).json({ message: `Deleted ${result.affectedRows} responses successfully` });
  } catch (err) {
    console.error('[Delete All Responses Error]', err.message);
    res.status(500).json({ message: 'Database error' });
  }
};

module.exports = {
  askAI,
  getSavedResponses,
  deleteResponse,
  deleteAllResponses
};
