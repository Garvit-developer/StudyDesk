const createGroqModel = require("../config/groqAi.js");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const generateQuiz = async (req, res) => {
    try {
        const { subject, grade, numQuestions = 5 } = req.body;

        if (!subject || !grade) {
            return res.status(400).json({
                success: false,
                message: "Subject and grade are required"
            });
        }

        const model = createGroqModel(0.7);

        const systemPrompt = `You are an expert educational assessment creator. 
    Create a ${numQuestions}-question multiple choice quiz for Grade ${grade} on the subject of ${subject}.
    
    Output MUST be a valid JSON object with the following structure:
    {
      "title": "Quiz Title",
      "questions": [
        {
          "question": "Question text?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "The exact text of the correct option",
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    }
    
    Ensure the difficulty is appropriate for Grade ${grade}. 
    Provide only the JSON. Do not include any other text or markdown formatting.`;

        const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage(`Generate a quiz about ${subject} for grade ${grade}`)
        ];

        const response = await model.invoke(messages);

        // Clean potential markdown code blocks if AI included them
        let content = response.content.trim();
        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (content.startsWith("```")) {
            content = content.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const quizData = JSON.parse(content);

        res.status(200).json({
            success: true,
            quiz: quizData
        });
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate quiz. Please try again."
        });
    }
};

module.exports = {
    generateQuiz
};
