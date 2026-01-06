const createGroqModel = require("../config/groqAi.js");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { saveAIResponse } = require("../models/aiResponses.model");
// Grade levels
const GRADE_LEVELS = [
  "1st-3rd",
  "4th-5th",
  "6th-8th",
  "9th-10th",
  "11th-12th",
  "college",
  "university",
];

// Agent Classes

// 1. Science
class ScienceAgent {
  constructor() {
    this.model = createGroqModel(0.7);
    this.name = "Science Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Science teacher specializing in ${grade} level education.
        Cover topics in Physics, Chemistry, Biology, Earth Science, and Environmental Science.
        Provide clear explanations with examples appropriate for ${grade} level students.
        Use simple analogies and real-world applications when possible.`;

    try {
      let result = {
        agent: this.name,
        grade: grade,
        success: true,
      };

      // Get direct answer first
      const directMessages = [
        new SystemMessage(
          basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer.`
        ),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      const directResponse = await this.model.invoke(directMessages);
      result.answer = directResponse.content;

      // Get explanation if requested
      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            // 🎯 FIX: Embed the grade level and instruction directly into the SystemMessage
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation of the scientific concept with reasoning, examples, analogies, and real-world applications. Focus on WHY and HOW the science works.
            **Tailor the language and complexity of this entire explanation to a Grade ${grade} level.** Use simple vocabulary and analogies appropriate for that age group.`
          ),
          // Optional: You can remove the Grade Level from the HumanMessage since it's now in the SystemMessage
          new HumanMessage(`Question: ${question}`),
        ];
        const explanationResponse = await this.model.invoke(
          explanationMessages
        );
        result.explanation = explanationResponse.content;
      }

      // Get steps if requested
      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX: Add grade constraint to control the complexity of the scientific steps
            `\n\nIMPORTANT: Break down the scientific process or solution into clear, numbered steps. Each step should be concise and show the logical progression.
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve simple, observable actions. Steps for higher grades must include rigorous scientific terminology and detailed experimental methodology.`
          ),
          new HumanMessage(`Question: ${question}`), // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return {
        agent: this.name,
        grade: grade,
        error: error.message,
        success: false,
      };
    }
  }
}

// 2. history
class HistoryAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "History Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert History teacher specializing in ${grade} level education.
        Cover world history, regional history, historical events, civilizations, and historical figures.
        Present information in an engaging narrative style appropriate for ${grade} level students.
        Connect historical events to modern context when relevant.`;

    try {
      let result = {
        agent: this.name,
        grade: grade,
        success: true,
      };

      // Get direct answer first
      const directMessages = [
        new SystemMessage(
          // 🎯 FIX: Explicitly tell the model to use the specified grade level for the tone and complexity.
          basePrompt +
          `\n\nIMPORTANT: Provide a direct, concise answer with essential historical facts. 
        **Adjust the language and complexity of the answer to a Grade ${grade} level** to ensure it is easily understood by a student in that age group.`
        ),
        // Optional: Since the grade is in the SystemMessage, you can simplify the HumanMessage
        new HumanMessage(`Question: ${question}`),
      ];
      const directResponse = await this.model.invoke(directMessages);
      result.answer = directResponse.content;

      // Get explanation if requested
      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            `\n\nIMPORTANT: Provide detailed historical context, causes, effects, significance, and connections to modern times. Explain WHY events happened and their broader impact.`
          ),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        const explanationResponse = await this.model.invoke(
          explanationMessages
        );
        result.explanation = explanationResponse.content;
      }

      // Get steps if requested
      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            `\n\nIMPORTANT: Present the historical information in clear, chronological steps. Number each major event or phase with key dates and figures.`
          ),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        const stepsResponse = await this.model.invoke(stepsMessages);
        result.steps = stepsResponse.content;
      }

      return result;
    } catch (error) {
      return {
        agent: this.name,
        grade: grade,
        error: error.message,
        success: false,
      };
    }
  }
}

// 3. geography
class GeographyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Geography Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Geography teacher specializing in ${grade} level education.
        Cover physical geography, human geography, world countries, capitals, climate, and environmental topics.
        Use descriptive language and practical examples suitable for ${grade} level understanding.
        Include interesting facts and real-world connections.`;

    try {
      let result = {
        agent: this.name,
        grade: grade,
        success: true,
      };

      // Get direct answer first
      const directMessages = [
        new SystemMessage(
          // 🎯 FIX: Explicitly instruct the model to constrain the language and complexity by the grade level.
          basePrompt +
          `\n\nIMPORTANT: Provide a direct, concise answer with essential geographical facts. 
        **Tailor the language and complexity of this answer to a Grade ${grade} level** to ensure it is easily understood by a student in that age group.`
        ),
        // Optional: The HumanMessage can be simplified since the grade is now in the SystemMessage.
        new HumanMessage(`Question: ${question}`),
      ];
      const directResponse = await this.model.invoke(directMessages);
      result.answer = directResponse.content;

      // Get explanation if requested
      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            `\n\nIMPORTANT: Provide detailed geographical context, processes, causes, effects, and real-world connections. Explain WHY geographical phenomena occur and their broader significance.`
          ),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        const explanationResponse = await this.model.invoke(
          explanationMessages
        );
        result.explanation = explanationResponse.content;
      }

      // Get steps if requested
      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            `\n\nIMPORTANT: Present the geographical information in clear, logical steps. Number each major component or process with specific locations and examples.`
          ),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        const stepsResponse = await this.model.invoke(stepsMessages);
        result.steps = stepsResponse.content;
      }

      return result;
    } catch (error) {
      return {
        agent: this.name,
        grade: grade,
        error: error.message,
        success: false,
      };
    }
  }
}

// 4. computer science
class ComputerScienceAgent {
  constructor() {
    this.model = createGroqModel(0.6); // adjust temperature as needed
    this.name = "Computer Science Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Computer Science teacher specializing in ${grade} level education.
        Cover topics such as programming (Python,Javascript, Java, etc.), algorithms, data structures, computer fundamentals, software engineering, and computational thinking.
        Tailor your explanations and examples according to the ${grade} level.
        Use analogies, real-life scenarios, and code snippets when needed to simplify concepts.`;

    try {
      let result = {
        agent: this.name,
        grade: grade,
        success: true,
      };

      // Direct concise answer
      const directMessages = [
        new SystemMessage(
          // 🎯 FIX: Explicitly tell the model to constrain the language and complexity by the grade level.
          basePrompt +
          `\n\nIMPORTANT: Provide a direct, concise answer with core information. 
        **Tailor the language and complexity of this answer to a Grade ${grade} level** to ensure it is easily understood by a student in that age group.`
        ),
        // Optional: You can simplify the HumanMessage since the grade is in the SystemMessage.
        new HumanMessage(`Question: ${question}`),
      ];
      const directResponse = await this.model.invoke(directMessages);
      result.answer = directResponse.content;

      // Detailed explanation
      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation of the concept with examples and clarity. Focus on WHY and HOW the concept works. Use code snippets or diagrams if needed.`
          ),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        const explanationResponse = await this.model.invoke(
          explanationMessages
        );
        result.explanation = explanationResponse.content;
      }

      // Step-by-step breakdown
      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            `\n\nIMPORTANT: Break down the solution or explanation into clear, numbered steps. Include code or pseudocode if it helps in understanding.`
          ),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        const stepsResponse = await this.model.invoke(stepsMessages);
        result.steps = stepsResponse.content;
      }

      return result;
    } catch (error) {
      return {
        agent: this.name,
        grade: grade,
        error: error.message,
        success: false,
      };
    }
  }
}

// 5. maths
class MathematicsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Mathematics Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Mathematics teacher specializing in ${grade} level education.
        Cover topics such as arithmetic, algebra, geometry, trigonometry, calculus, probability, statistics, and mathematical reasoning.
        Tailor your explanations and examples according to the ${grade} level.
        Use analogies, real-life applications, and step-by-step solutions to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            // 🎯 FIX: Explicitly instruct the model to adjust the complexity and language for the grade.
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW it works, and use examples. 
        **Tailor the mathematical concepts, vocabulary, and examples to a Grade ${grade} level.** For lower grades, use simple counting and real-world scenarios. For higher grades, use appropriate mathematical notation and theory.`
          ),
          // Optional: You can simplify the HumanMessage since the grade is in the SystemMessage.
          new HumanMessage(`Question: ${question}`),
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      if (steps) {
        const stepsMessages = [
          new SystemMessage(basePrompt + `\n\nIMPORTANT: Break down into clear, numbered steps with calculations or proofs if needed.`),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 6. English
class EnglishAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "English Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert English teacher specializing in ${grade} level education.
        Cover topics such as grammar, vocabulary, literature, writing skills, comprehension, spoken English, and communication skills.
        Tailor your explanations and examples according to the ${grade} level.
        Use stories, everyday language, and practical applications to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      const explanationMessages = [
        new SystemMessage(
          // 🎯 FIX: Explicitly instruct the model to constrain the language, complexity, and examples by the grade level.
          basePrompt +
          `\n\nIMPORTANT: Provide a detailed explanation with examples and clarity. Focus on WHY and HOW language works with real-world usage. 
        **Tailor the vocabulary, complexity, and real-world usage examples to a Grade ${grade} level.** Use age-appropriate literary or grammatical terms.`
        ),
        // Optional: The HumanMessage can be simplified as the grade constraint is now explicit in the SystemMessage.
        new HumanMessage(`Question: ${question}`),
      ];

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX: Add grade constraint to control complexity of language arts steps
            `\n\nIMPORTANT: Break down grammar rules, writing structures, or analysis into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on basic concepts (e.g., forming a complete sentence). Steps for higher grades must involve complex structural rules, rhetorical analysis, or detailed revision techniques.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 7. Physics
class PhysicsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Physics Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Physics teacher specializing in ${grade} level education.
        Cover topics such as mechanics, thermodynamics, waves, optics, electricity, magnetism, modern physics, and astrophysics.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-world examples, diagrams, and mathematical derivations to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            // 🎯 FIX: Explicitly tell the model to constrain the complexity of the physics, formulas, and examples by the grade level.
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW it works, with formulas and examples. 
        **Tailor the physics concepts, the complexity of the formulas, the vocabulary, and the examples to a Grade ${grade} level.** Use simple, common analogies and real-world examples for lower grades, and rigorous scientific terminology for higher grades.`
          ),
          // Optional: The HumanMessage can be simplified since the grade constraint is now explicit in the SystemMessage.
          new HumanMessage(`Question: ${question}`),
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX: Add grade constraint to control complexity of physics steps and derivations
            `\n\nIMPORTANT: Break down physical problems into clear, numbered steps, including derivations or problem-solving methods. 
            **Ensure the language, mathematical complexity, and detail of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve basic arithmetic and observable processes. Steps for higher grades must include rigorous algebraic derivations, vector analysis, and precise scientific terminology.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 8. Chemistry
class ChemistryAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Chemistry Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Chemistry teacher specializing in ${grade} level education.
        Cover topics such as atomic structure, periodic table, bonding, chemical reactions, stoichiometry, organic chemistry, inorganic chemistry, and physical chemistry.
        Tailor your explanations and examples according to the ${grade} level.
        Use equations, diagrams, and real-life chemical phenomena to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            // 🎯 FIX: Explicitly tell the model to constrain the complexity of the chemistry, reactions, and examples by the grade level.
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW it works, and include reactions or experiments. 
        **Tailor the chemical concepts, the representation of reactions, the vocabulary, and the experiments to a Grade ${grade} level.** Use simple models (like balls and sticks) for lower grades and rigorous chemical notation for higher grades.`
          ),
          // Optional: The HumanMessage can be simplified since the grade constraint is now explicit in the SystemMessage.
          new HumanMessage(`Question: ${question}`),
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX: Add grade constraint to control complexity and detail of the chemical steps and equations
            `\n\nIMPORTANT: Break down chemical processes into clear, numbered steps, with equations where needed. 
            **Ensure the language, detail, and complexity of the steps and equations are appropriate for a Grade ${grade} level.** Steps for lower grades should use word equations and simple mixing. Steps for higher grades must include balanced chemical equations, stoichiometry, and complex reaction mechanisms.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 9. Biology
class BiologyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Biology Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Biology teacher specializing in ${grade} level education.
        Cover topics such as cell biology, genetics, evolution, human anatomy, physiology, botany, zoology, microbiology, and ecology.
        Tailor your explanations and examples according to the ${grade} level.
        Use diagrams, analogies, and real-life biological processes to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            // 🎯 FIX: Explicitly instruct the model to constrain the complexity of the content, diagrams, and language by the grade level.
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW it works, with diagrams or processes. 
        **Tailor the complexity of the concepts, diagrams/processes, and vocabulary to a Grade ${grade} level.** Diagrams for lower grades should be simple and colorful, while diagrams for higher grades can include scientific detail and labels.`
          ),
          // Optional: The HumanMessage can be simplified since the grade constraint is now explicit in the SystemMessage.
          new HumanMessage(`Question: ${question}`),
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX: Add grade constraint to control complexity and detail of the biological steps
            `\n\nIMPORTANT: Break down biological processes into clear, numbered steps with examples. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should use simple, observable actions. Steps for higher grades can involve complex molecular mechanisms, precise terminology, and cellular detail.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 10. Social Science
class SocialScienceAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Social Science Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Social Science teacher specializing in ${grade} level education.
        Cover topics such as history, geography, civics, economics, culture, and society.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-world contexts, case studies, and simplified concepts to aid understanding.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            // 🎯 FIX: Explicitly tell the model to constrain the complexity of the social concepts, examples, and language by the grade level.
            basePrompt +
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW social concepts work, with examples or case studies. 
        **Tailor the complexity of the social science concepts, case studies, and vocabulary to a Grade ${grade} level.** Use simple, personal examples for lower grades (e.g., classroom behavior) and complex societal case studies for higher grades (e.g., historical movements).`
          ),
          // Optional: The HumanMessage can be simplified since the grade constraint is now explicit in the SystemMessage.
          new HumanMessage(`Question: ${question}`),
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }
      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX: Add grade constraint to control complexity and detail of the steps
            `\n\nIMPORTANT: Break down historical, geographical, or political processes into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should be simple and focus on major events. Steps for higher grades can involve complex sequencing, analysis of causes, and long-term consequences.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

//11. Civics / Political Science
class CivicsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Civics / Political Science Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Civics / Political Science teacher specializing in ${grade} level education.
        Cover topics such as democracy, government structures, constitution, rights and duties, elections, political ideologies, and governance.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-world political systems, case studies, and simplified reasoning to explain concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`),
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW geography concepts work, with diagrams or maps. 
            **Tailor the complexity of the concepts, maps, diagrams, and vocabulary to a Grade ${grade} level.**`
          ),
          new HumanMessage(`Question: ${question}`), // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down geographical processes into clear, numbered steps. 
            **Ensure the language and the number of steps are appropriate for a Grade ${grade} level.**`
          ),
          new HumanMessage(`Question: ${question}`), // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 12. Economics
class EconomicsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Economics Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Economics teacher specializing in ${grade} level education.
        Cover topics such as microeconomics, macroeconomics, supply and demand, money, banking, trade, development, and economic policies.
        Tailor your explanations and examples according to the ${grade} level.
        Use graphs, real-world examples, and simplified models to explain concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW economic principles work, using examples or case studies. 
            **Tailor the complexity of the economic concepts, case studies, and vocabulary to a Grade ${grade} level.** Use simple, relatable analogies for lower grades (e.g., selling lemonade) and formal economic terminology for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down economic problems or analysis into clear, numbered steps with diagrams or calculations. 
            **Ensure the language, calculations, and diagrams are appropriate for a Grade ${grade} level.** For lower grades, use simple addition/subtraction. For higher grades, use appropriate formulas and graph terminology.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 13. Computer IT / Informatics Practices
class ComputerITAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Computer Science / IT Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Computer Science / IT teacher specializing in ${grade} level education.
        Cover topics such as programming (Python, Java, JavaScript), data structures, algorithms, databases, networking, software engineering, and computational thinking.
        Tailor your explanations and examples according to the ${grade} level.
        Use code snippets, diagrams, and real-world examples to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW coding or IT concepts work, with examples or diagrams. 
            **Tailor the complexity of the IT concepts, examples, and diagrams to a Grade ${grade} level.** Use simple analogies (like following a recipe) for lower grades and precise technical terminology for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down programming or IT solutions into clear, numbered steps with code or diagrams. 
            **Ensure the language, code snippets, and diagram complexity are appropriate for a Grade ${grade} level.** For lower grades, use block-based code or pseudocode. For higher grades, use professional code syntax and advanced flowcharts.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 14. Environmental Studies / Environmental Science
class EnvironmentalScienceAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Environmental Science Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Environmental Science teacher specializing in ${grade} level education.
        Cover topics such as ecosystems, biodiversity, pollution, conservation, climate change, renewable energy, and sustainable development.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-world examples, diagrams, and simplified explanations to explain environmental concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW environmental processes work, with examples. 
            **Tailor the complexity of the concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, relatable analogies (like watering a garden) for lower grades and rigorous scientific terminology for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down environmental processes or solutions into clear, numbered steps. 
            **Ensure the language, detail, and number of steps are appropriate for a Grade ${grade} level.** Processes for lower grades should be simple and easy to follow. Processes for higher grades can include complex, multi-stage details.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 15. General Knowledge
class GeneralKnowledgeAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "General Knowledge Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert General Knowledge teacher specializing in ${grade} level education.
        Cover topics such as current affairs, history, geography, science, sports, culture, and important global facts.
        Tailor your explanations and examples according to the ${grade} level.
        Use simplified explanations, real-world examples, and easy-to-remember facts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation, WHY and HOW the information is relevant, with examples. 
            **Tailor the complexity of the information, examples, and vocabulary to a Grade ${grade} level.** Use simple, concrete examples for lower grades and abstract, nuanced discussion for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down facts or explanations into clear, numbered steps for easy understanding. 
            **Ensure the language, detail, and number of steps are appropriate for a Grade ${grade} level.** Processes for lower grades should be simple and easy to follow (fewer steps).`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 16. Moral Education / Value Education
class MoralEducationAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Moral Education / Value Education Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Moral Education / Value Education teacher specializing in ${grade} level education.
        Cover topics such as ethics, values, character building, honesty, empathy, civic responsibility, and life skills.
        Tailor your explanations and examples according to the ${grade} level.
        Use stories, real-life examples, and practical situations to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation, WHY and HOW moral values apply, with examples. 
            **Tailor the ethical concepts, the complexity of the examples, and the vocabulary to a Grade ${grade} level.** Use simple, direct examples (like sharing a toy) for lower grades and nuanced, scenario-based examples for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down morals, ethics, or values into clear, numbered steps or practices. 
            **Ensure the language, detail, and number of steps/practices are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on immediate actions. Steps for higher grades can involve deeper reflection or complex decision-making frameworks.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 17. Arts & Crafts / Fine Arts
class ArtsCraftsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Arts & Crafts / Fine Arts Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Arts & Crafts / Fine Arts teacher specializing in ${grade} level education.
        Cover topics such as painting, drawing, sculpture, handicrafts, design, art history, and creative techniques.
        Tailor your explanations and examples according to the ${grade} level.
        Use step-by-step demonstrations, real-life projects, and visual aids to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW art techniques work, with examples. 
            **Tailor the complexity of the art concepts, techniques, and vocabulary to a Grade ${grade} level.** Use simple shapes and primary colors for lower grades, and complex compositional theory for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down art techniques or projects into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Projects for lower grades should be simple and focus on basic motor skills. Projects for higher grades can involve advanced layering or detailed drawing.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 18. Music / Performing Arts
class MusicAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Music / Performing Arts Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Music / Performing Arts teacher specializing in ${grade} level education.
        Cover topics such as music theory, instruments, singing, dance, drama, performance skills, and creative expression.
        Tailor your explanations and examples according to the ${grade} level.
        Use demonstrations, examples, and practice exercises to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW performing arts techniques work, with examples. 
            **Tailor the complexity of the arts concepts, techniques, and vocabulary to a Grade ${grade} level.** Use simple movements or direct character emotions for lower grades, and technical terminology (e.g., 'plié,' 'diaphragmatic breathing') for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down music, dance, or drama techniques into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should be simple and focused on single actions. Steps for higher grades can involve complex sequencing, musical notation, or emotional blocking.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 19. Physical Education
class PhysicalEducationAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Physical Education Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Physical Education teacher specializing in ${grade} level education.
        Cover topics such as sports, fitness, health, exercise techniques, nutrition, team games, individual games, and wellness.
        Tailor your explanations and examples according to the ${grade} level.
        Use demonstrations, exercises, and real-life examples to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW exercises or sports techniques work. 
            **Tailor the physiological and biomechanical concepts, the techniques, and the vocabulary to a Grade ${grade} level.** Use simple, common analogies (like a lever or a spring) for lower grades and specific anatomical terminology for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down fitness, health, or sports techniques into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on safety and simple movements. Steps for higher grades can involve complex sequencing, form cues, and advanced training principles.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 20. Hindi (or Second Language)
class HindiAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Hindi / Second Language Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Hindi / Second Language teacher specializing in ${grade} level education.
        Cover topics such as grammar, vocabulary, literature, comprehension, writing skills, and communication.
        Tailor your explanations and examples according to the ${grade} level.
        Use stories, examples, and step-by-step explanations to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW language rules work, with examples. 
            **Tailor the linguistic concepts, the vocabulary, and the examples to a Grade ${grade} level.** Use simple sentence structure and basic parts of speech for lower grades, and complex grammatical terms and rhetorical devices for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down grammar, writing, or comprehension into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on simple sequencing (e.g., how to capitalize a sentence). Steps for higher grades can involve multi-step processes like drafting an essay, analyzing literary devices, or formal grammar rules.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 21. Accountancy
class AccountancyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Accountancy Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Accountancy teacher specializing in ${grade} level education.
        Cover topics such as accounting principles, journal entries, ledger, trial balance, financial statements, cost accounting, and auditing.
        Tailor your explanations and examples according to the ${grade} level.
        Use step-by-step calculations, examples, and real-life scenarios to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide a detailed explanation with clarity, WHY and HOW accounting rules apply, using examples. 
            **Tailor the complexity of the accounting concepts, rules, and vocabulary to a Grade ${grade} level.** Use simple, personal finance examples for lower grades (like saving money) and formal accounting principles (like accrual or depreciation) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down accounting processes into clear, numbered steps with calculations. 
            **Ensure the language, calculations, and number of steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve basic addition and subtraction. Steps for higher grades can involve double-entry bookkeeping, T-accounts, or ratio analysis.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 22. Business Studies
class BusinessStudiesAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Business Studies Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Business Studies teacher specializing in ${grade} level education.
        Cover topics such as business environment, management, marketing, finance, entrepreneurship, human resource management, and organizational behavior.
        Tailor your explanations and examples according to the ${grade} level.
        Use case studies, real-life examples, and simplified explanations.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW business concepts work, with examples. 
            **Tailor the complexity of the business concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, direct examples (like buying and selling) for lower grades and complex terminology (like 'supply chain' or 'market segmentation') for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down business problems or concepts into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve simple, direct processes (like planning a budget). Steps for higher grades can involve multi-stage processes like calculating profit margins, strategic planning, or risk analysis.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 23. Sociology
class SociologyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Sociology Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Sociology teacher specializing in ${grade} level education.
        Cover topics such as social institutions, culture, family, education, social change, and social problems.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-life examples, case studies, and analogies to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW social concepts work, with examples. 
            **Tailor the complexity of the sociological concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, immediate examples (like teamwork in a class) for lower grades and complex societal case studies (like cultural norms or institutions) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down sociological concepts or examples into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve simple behavioral sequences. Steps for higher grades can involve complex analysis of social structures or research methodology.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 24. Psychology
class PsychologyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Psychology Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Psychology teacher specializing in ${grade} level education.
        Cover topics such as human behavior, cognition, emotions, personality, development, mental health, and psychological theories.
        Tailor your explanations and examples according to the ${grade} level.
        Use case studies, experiments, and real-life examples to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW psychological concepts work, with examples. 
            **Tailor the complexity of the concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, relatable scenarios (like feeling happy or sad) for lower grades and precise psychological terminology (like 'cognitive bias' or 'operant conditioning') for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down psychological processes into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve simple emotional or behavioral sequences. Steps for higher grades can involve complex cognitive processes, research methodologies, or therapeutic techniques.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 25. Philosophy
class PhilosophyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Philosophy Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Philosophy teacher specializing in ${grade} level education.
        Cover topics such as logic, ethics, metaphysics, epistemology, philosophy of mind, political philosophy, and great thinkers.
        Tailor your explanations and examples according to the ${grade} level.
        Use analogies, thought experiments, and simplified reasoning to explain concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW philosophical ideas work, with examples. 
            **Tailor the abstract concepts, historical context, and vocabulary to a Grade ${grade} level.** Use simple, concrete questions (like "What is fair?") for lower grades and complex philosophical terminology (like 'existentialism' or 'epistemology') for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down philosophical arguments into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on identifying simple claims and reasons. Steps for higher grades can involve analyzing premises, logical fallacies, and counterarguments.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 26. Home Science
class HomeScienceAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Home Science Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Home Science teacher specializing in ${grade} level education.
        Cover topics such as nutrition, health, child development, family resource management, home management, and textiles.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-life examples, experiments, and step-by-step guides to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW home science concepts work, with examples. 
            **Tailor the science concepts, practical examples, and vocabulary to a Grade ${grade} level.** Use simple, immediate examples (like washing hands) for lower grades and complex topics (like balanced budgeting or textile chemistry) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down home science practices into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on simple tasks (like setting a table). Steps for higher grades can involve multi-step processes like recipe scaling, garment repair, or complex financial planning.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 27. Entrepreneurship
class EntrepreneurshipAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Entrepreneurship Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Entrepreneurship teacher specializing in ${grade} level education.
        Cover topics such as business idea generation, start-ups, business planning, marketing, finance, innovation, and risk management.
        Tailor your explanations and examples according to the ${grade} level.
        Use case studies, real-life examples, and simplified strategies.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW entrepreneurship concepts work, with examples. 
            **Tailor the business concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, relatable scenarios (like a lemonade stand) for lower grades and complex market analysis/funding concepts for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down entrepreneurial processes into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should be simple and focus on idea generation and sales. Steps for higher grades can involve market research, financial planning, and scaling.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 28. Biotechnology
class BiotechnologyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Biotechnology Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Biotechnology teacher specializing in ${grade} level education.
        Cover topics such as genetic engineering, molecular biology, cell biology, bioinformatics, bioprocessing, and applications of biotechnology.
        Tailor your explanations and examples according to the ${grade} level.
        Use diagrams, experiments, and real-life examples to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW biotechnology concepts work, with examples. 
            **Tailor the molecular and cellular concepts, the techniques, and the vocabulary to a Grade ${grade} level.** Use simple analogies (like using Lego bricks to change DNA) for lower grades and specific terminology (like genetic engineering or protein synthesis) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down biotechnology experiments or concepts into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve simple tasks (like making yogurt). Steps for higher grades can involve complex laboratory procedures, ethical considerations, or genetic modifications.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 29. Statistics
class StatisticsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Statistics Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Statistics teacher specializing in ${grade} level education.
        Cover topics such as probability, data analysis, descriptive statistics, inferential statistics, distributions, regression, and hypothesis testing.
        Tailor your explanations and examples according to the ${grade} level.
        Use examples, charts, graphs, and step-by-step calculations to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Provide detailed explanation with clarity, WHY and HOW statistical methods work, with examples. 
            **Tailor the complexity of the statistical concepts, formulas, and vocabulary to a Grade ${grade} level.** Use simple terms (like 'average') for lower grades and precise terms (like 'standard deviation' or 'regression') for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down statistical problems into clear, numbered steps. 
            **Ensure the language, calculations, and number of steps are appropriate for a Grade ${grade} level.** Steps for lower grades should involve basic counting and sums. Steps for higher grades can involve complex formulas, data analysis, and result interpretation.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}
// 30. Coding / Computational Thinking
class CodingAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Coding / Computational Thinking Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Coding / Computational Thinking teacher specializing in ${grade} level education.
        Cover topics such as algorithms, programming logic, coding basics, debugging, computational problem solving, and real-world coding applications.
        Tailor your explanations and examples according to the ${grade} level.
        Use code snippets, logical puzzles, and practical exercises to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW coding or problem-solving methods work, with examples. 
            **Tailor the complexity of the concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, block-based analogies for lower grades and precise algorithmic terms for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down coding or problem-solving techniques into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should be simple logical sequences. Steps for higher grades can involve debugging, optimization, or specific coding syntax.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 31. Artificial Intelligence (AI)
class ArtificialIntelligenceAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Artificial Intelligence Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Artificial Intelligence (AI) teacher specializing in ${grade} level education.
        Cover topics such as AI basics, data, machine learning concepts, real-world AI applications, ethics in AI, and problem-solving.
        Tailor your explanations and examples according to the ${grade} level.
        Use relatable examples, simulations, and real-life applications to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW AI concepts work, with examples. 
            **Tailor the complexity of the AI concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple analogies (like sorting toys or guessing games) for lower grades and technical terms (like neural networks or machine learning) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down AI concepts or problem-solving tasks into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should be simple logical sequences. Steps for higher grades can involve algorithmic thinking, data processing stages, or ethical considerations.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 32. Life Skills
class LifeSkillsAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Life Skills Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Life Skills teacher specializing in ${grade} level education.
        Cover topics such as self-awareness, decision-making, communication, stress management, teamwork, empathy, and resilience.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-life scenarios, role plays, and stories to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW life skills matter, with examples. 
            **Tailor the life skills concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, direct examples (like tidying a room) for lower grades and complex decision-making scenarios (like managing a budget) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down life skills into clear, numbered practices. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Practices for lower grades should be simple household or school tasks. Steps for higher grades can involve multi-step processes like planning a schedule or resolving a conflict.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 33. Digital Literacy
class DigitalLiteracyAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Digital Literacy Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Digital Literacy teacher specializing in ${grade} level education.
        Cover topics such as safe internet use, online research, digital tools, online collaboration, cybersecurity, and responsible digital citizenship.
        Tailor your explanations and examples according to the ${grade} level.
        Use real-world digital practices, case studies, and step-by-step guides to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW digital literacy skills matter, with examples. 
            **Tailor the digital concepts, real-world examples, and vocabulary to a Grade ${grade} level.** Use simple device usage and online safety for lower grades, and concepts like data privacy and critical source evaluation for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down digital literacy skills into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on simple tasks (e.g., using a mouse, searching safely). Steps for higher grades can involve creating complex digital content, evaluating information bias, or managing a digital identity.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 34. Vocational Education
class VocationalEducationAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Vocational Education Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Vocational Education teacher specializing in ${grade} level education (from Grade 6 onwards).
        Cover topics such as trades, skills development, entrepreneurship, hands-on projects, and practical career-oriented learning.
        Tailor your explanations and examples according to the ${grade} level.
        Use workshops, real-world tasks, and step-by-step guides to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW vocational skills are important, with practical examples. 
            **Tailor the job concepts, benefits, and vocabulary to a Grade ${grade} level.** Use simple, common trades (like cooking or building) for lower grades and complex career path examples for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down vocational skills into clear, numbered steps or practices. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on safe, basic tool use or simple task completion. Steps for higher grades can involve complex procedures, equipment operation, or troubleshooting.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 35. Experiential / Project-based Learning
class ProjectBasedLearningAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Experiential / Project-based Learning Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Experiential / Project-based Learning facilitator specializing in ${grade} level education.
        Cover topics such as project-based learning methods, teamwork, real-world projects, research, problem-solving, and reflection.
        Tailor your guidance and examples according to the ${grade} level.
        Use examples of projects, experiments, and real-life applications to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW project-based learning works, with examples. 
            **Tailor the pedagogical concepts, benefits, and examples to a Grade ${grade} level.** Use simple, concrete project examples (like building a birdhouse) for lower grades and complex interdisciplinary challenges for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down project-based learning methods into clear, numbered steps. 
            **Ensure the language, detail, and number of steps are appropriate for a Grade ${grade} level.** Steps for lower grades should be simple and focus on task completion. Steps for higher grades can involve complex planning, iteration, and peer critique.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 36. Indian Knowledge Systems (IKS)
class IKSAagent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Indian Knowledge Systems (IKS) Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Indian Knowledge Systems (IKS) teacher specializing in ${grade} level education.
        Cover topics such as Indian philosophy, science, mathematics, arts, Ayurveda, Yoga, literature, and cultural heritage.
        Tailor your explanations and examples according to the ${grade} level.
        Use stories, traditional practices, and contextual examples to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW Indian Knowledge Systems are valuable, with examples. 
            **Tailor the philosophical concepts, historical context, and vocabulary to a Grade ${grade} level.** Use simple, relatable examples (like the origins of Yoga or Ayurveda) for lower grades and nuanced academic discussion for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down IKS concepts into clear, numbered steps or practices. 
            **Ensure the language, detail, and complexity of the steps are appropriate for a Grade ${grade} level.** Practices for lower grades should be simple and practical (like a basic breathing exercise). Steps for higher grades can involve complex philosophical methodologies or detailed ancient engineering processes.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 37. Multiple Languages / Mother Tongue
class LanguageDiversityAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Multiple Languages / Mother Tongue Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Language and Multilingual Education teacher specializing in ${grade} level education.
        Cover topics such as mother tongue, regional languages, multilingualism, vocabulary, communication, and cultural identity.
        Tailor your explanations and examples according to the ${grade} level.
        Use stories, dialogues, and relatable examples to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW multiple languages support learning, with examples. 
            **Tailor the cognitive science concepts and the vocabulary to a Grade ${grade} level.** Use simple, relatable analogies (like having multiple tools for one job) for lower grades and precise terms (like cognitive flexibility) for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down multilingual practices into clear, numbered steps. 
            **Ensure the language, detail, and complexity of the practices are appropriate for a Grade ${grade} level.** Steps for lower grades should focus on simple language mixing and vocabulary building. Steps for higher grades can involve immersion techniques and cultural analysis.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 38. Environmental Education / Sustainability
class EnvironmentalEducationAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Environmental Education / Sustainability Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Environmental Education teacher specializing in ${grade} level education.
        Cover topics such as ecosystems, climate change, sustainability, conservation, renewable energy, and responsible citizenship.
        Tailor your explanations and examples according to the ${grade} level.
        Use case studies, real-life examples, and simple actions to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 1: Add grade constraint to Explanation
            `\n\nIMPORTANT: Explain WHY and HOW sustainability practices work, with examples. 
            **Tailor the complexity of the sustainability concepts, examples, and vocabulary to a Grade ${grade} level.** Use simple, personal examples (like turning off lights) for lower grades and complex systems-thinking concepts for higher grades.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      // ----------------------------------------------------------------------------------

      if (steps) {
        const stepsMessages = [
          new SystemMessage(
            basePrompt +
            // 🎯 FIX 2: Add grade constraint to Steps
            `\n\nIMPORTANT: Break down environmental practices into clear, numbered steps. 
            **Ensure the language, detail, and number of steps/practices are appropriate for a Grade ${grade} level.** Steps for  lower grades should be simple household or school actions. Steps for higher grades can involve resource management or policy analysis.`
          ),
          new HumanMessage(`Question: ${question}`) // Simplified HumanMessage
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }
      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}

// 39. Critical Thinking & Problem Solving
class CriticalThinkingAgent {
  constructor() {
    this.model = createGroqModel(0.6);
    this.name = "Critical Thinking & Problem Solving Expert";
  }

  async processQuestion(question, grade, explanation, steps) {
    const basePrompt = `You are an expert Critical Thinking & Problem Solving teacher specializing in ${grade} level education.
        Cover topics such as logic, reasoning, creativity, decision-making, analysis, and evaluating evidence.
        Tailor your explanations and examples according to the ${grade} level.
        Use puzzles, debates, scenarios, and problem-solving tasks to simplify concepts.`;

    try {
      let result = { agent: this.name, grade: grade, success: true };

      const directMessages = [
        new SystemMessage(basePrompt + `\n\nIMPORTANT: Provide a direct, concise answer with core information.`),
        new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
      ];
      result.answer = (await this.model.invoke(directMessages)).content;

      if (explanation) {
        const explanationMessages = [
          new SystemMessage(
            //  FIX: Embed the grade level and instruction directly into the SystemMessage
            basePrompt +
            `\n\nIMPORTANT: Explain WHY and HOW critical thinking skills are useful, with examples. 
           Tailor this entire explanation to a **Grade ${grade}** level so that the language, 
           analogies, and complexity are perfectly appropriate for that age group. 
           Use simple, relatable examples.`
          ),
          new HumanMessage(`Question: ${question}`)
        ];
        result.explanation = (await this.model.invoke(explanationMessages)).content;
      }

      if (steps) {
        const stepsMessages = [
          new SystemMessage(basePrompt + `\n\nIMPORTANT: Break down critical thinking or problem-solving into clear, numbered steps.`),
          new HumanMessage(`Grade Level: ${grade}\nQuestion: ${question}`)
        ];
        result.steps = (await this.model.invoke(stepsMessages)).content;
      }

      return result;
    } catch (error) {
      return { agent: this.name, grade: grade, error: error.message, success: false };
    }
  }
}


// Boss Agent - Main Controller
class BossAgent {
  constructor() {
    this.model = createGroqModel(0.3);
    this.agents = {
      science: new ScienceAgent(),
      history: new HistoryAgent(),
      geography: new GeographyAgent(),
      computerscience: new ComputerScienceAgent(),
      mathematics: new MathematicsAgent(),
      english: new EnglishAgent(),
      physics: new PhysicsAgent(),
      chemistry: new ChemistryAgent(),
      biology: new BiologyAgent(),
      socialscience: new SocialScienceAgent(),
      civics: new CivicsAgent(),
      economics: new EconomicsAgent(),
      computerit: new ComputerITAgent(),
      environmentalscience: new EnvironmentalScienceAgent(),
      generalknowledge: new GeneralKnowledgeAgent(),
      moraleducation: new MoralEducationAgent(),
      artscrafts: new ArtsCraftsAgent(),
      music: new MusicAgent(),
      physicaleducation: new PhysicalEducationAgent(),
      hindi: new HindiAgent(),
      accountancy: new AccountancyAgent(),
      businessstudies: new BusinessStudiesAgent(),
      sociology: new SociologyAgent(),
      psychology: new PsychologyAgent(),
      philosophy: new PhilosophyAgent(),
      homescience: new HomeScienceAgent(),
      entrepreneurship: new EntrepreneurshipAgent(),
      biotechnology: new BiotechnologyAgent(),
      statistics: new StatisticsAgent(),
      coding: new CodingAgent(),
      ArtificialIntelligence: new ArtificialIntelligenceAgent(),
      lifeskills: new LifeSkillsAgent(),
      digitalliteracy: new DigitalLiteracyAgent(),
      vocationaleducation: new VocationalEducationAgent(),
      projectbasedlearning: new ProjectBasedLearningAgent(),
      iks: new IKSAagent(),
      languagediversity: new LanguageDiversityAgent(),
      environmentaleducation: new EnvironmentalEducationAgent(),
      criticalthinking: new CriticalThinkingAgent()
    };
  }

  async classifyQuestion(question) {
    const systemPrompt = `You are a question classifier. Analyze the given question and determine which subject it belongs to.
        
    Available subjects:
       - science: Physics, Chemistry, Biology, Earth Science, Environmental Science
       - geography: Physical geography, countries, capitals, climate, maps, locations
       - computerscience: Programming, algorithms, data structures, computer fundamentals, software engineering
       - mathematics: Mathematics, arithmetic, algebra, geometry, calculus, statistics
       - english: English language, literature, grammar, writing, communication
       - physics: Motion, forces, energy, waves, electricity
       - chemistry: Elements, compounds, reactions, lab experiments
       - biology: Plants, animals, human body, cells, ecosystems
       - socialscience: Society, culture, economy, politics, environment
       - civics: Government, democracy, laws, constitution, rights
       - history: Historical events, civilizations, historical figures, past events
       - economics: Markets, money, trade, demand-supply, development
       - computerit: IT applications, software tools, office automation
       - environmentalscience: Nature, sustainability, pollution, conservation
       - generalknowledge: Current affairs, trivia, global facts, awareness
       - moraleducation: Ethics, honesty, empathy, life values
       - artscrafts: Drawing, painting, craft, design, creativity
       - music: Singing, instruments, dance, drama, performance
       - physicaleducation: Sports, games, fitness, health, teamwork
       - hindi: Hindi language, grammar, vocabulary, literature, communication
       - accountancy: Accounting principles, balance sheets, financial records
       - businessstudies: Business management, marketing, organization, trade
       - sociology: Society, social groups, human behavior, culture
       - psychology: Human mind, behavior, emotions, learning
       - philosophy: Wisdom, critical thought, ethics, existence
       - homescience: Nutrition, home management, textiles, family welfare
       - entrepreneurship: Innovation, startups, leadership, business planning
       - biotechnology: Genetics, DNA, biotechnology applications, medicine
       - statistics: Data, probability, graphs, analysis, predictions
       - coding: Programming, logic, algorithms, debugging
       - Artificial Intelligence: Artificial intelligence, machine learning, data, AI applications, ethics
       - lifeskills: Communication, decision-making, stress management, empathy
       - digitalliteracy: Internet use, cybersecurity, digital tools, online safety
       - vocationaleducation: Practical skills, trades, entrepreneurship, careers
       - projectbasedlearning: Projects, teamwork, research, reflection
       - iks: Indian philosophy, science, culture, yoga, traditional knowledge
       - languagediversity: Regional languages, multilingual skills, communication
       - environmentaleducation: Ecology, climate change, renewable energy, sustainability
       - criticalthinking: Logic, reasoning, decision-making, creativity
       
        
        Respond with ONLY the subject name (science / history / geography / computerscience / mathematics / english / physics / chemistry / biology / socialscience / civics / economics / computerit / environmentalscience / generalknowledge / moraleducation / artscrafts / music / physicaleducation / hindi / accountancy / businessstudies / sociology / psychology / philosophy / homescience / entrepreneurship / biotechnology / statistics / coding / Artificial Intelligence / lifeskills / digitalliteracy / vocationaleducation / projectbasedlearning / iks / languagediversity / environmentaleducation / criticalthinking).

        If the question doesn't clearly fit any category, respond with "unknown".
  SPECIAL RULE:
- If the user asks "who developed you" or similar (who made you, who is your developer, etc.),
  then do not classify into any subject. Instead, directly answer: "I am developed by SkillEdu team."
`;

    try {
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(`Classify this question: ${question}`),
      ];

      const response = await this.model.invoke(messages);
      return response.content.toLowerCase().trim();
    } catch (error) {
      console.error("Classification error:", error);
      return "unknown";
    }
  }

  async handleQuestion(
    question,
    grade,
    subjectUser,
    explanation,
    steps,
    userId
  ) {
    // Validate grade (unchanged)
    if (!GRADE_LEVELS.includes(grade)) {
      return {
        success: false,
        error: `Invalid grade level. Must be one of: ${GRADE_LEVELS.join(
          ", "
        )}`,
      };
    }

    // Classify the question
    let subject = await this.classifyQuestion(question);

    // Convert user's subject request to lowercase for comparison
    const userSubjectLower = subjectUser ? subjectUser.toLowerCase() : null;

    // Determine if the grade is below the specialization level (e.g., below 10th-12th)
    const isLowerGrade = !["9th-10th", "college", "university"].includes(grade);

    // --- Subject Consolidation Logic for Lower Grades ---
    const scienceSubCategories = ["physics", "chemistry", "biology", "environmentalscience"];
    const socialScienceSubCategories = ["history", "geography", "civics", "economics"];

    // 1. Science Rerouting
    if (userSubjectLower === "science" && isLowerGrade && scienceSubCategories.includes(subject)) {
      subject = "science";
    }

    // 2. Social Science Rerouting
    if (userSubjectLower === "socialscience" && isLowerGrade && socialScienceSubCategories.includes(subject)) {
      subject = "socialscience";
    }
    // ----------------------------------------------------

    // Handle unknown or out-of-context questions (unchanged)
    if (subject === "unknown" || !this.agents[subject]) {
      return {
        success: false,
        answer: "Out of context question. I can only help with Computer Science, English, Science, Mathematics, History, and Geography questions.",
        supportedSubjects: [/* ... list of supported subjects ... */],
        providedQuestion: question,
        detectedSubject: subject,
      };
    }

    // ⚠️ FIX FOR GENERAL KNOWLEDGE MISMATCH ⚠️
    // Check for subject mismatch, but allow it to pass (i.e., don't throw an error) 
    // if the user requested "generalknowledge" (which often overlaps with core subjects).
    if (userSubjectLower && userSubjectLower !== subject) {
      // If the user requested General Knowledge, we skip the mismatch error.
      if (userSubjectLower === "generalknowledge") {
        // The question is routed to the detected subject (e.g., 'geography') 
        // in the 'try' block below, and no error is returned here.
      }
      // If it's a genuine mismatch (e.g., user asked 'math' but classified 'history'), throw the error.
      else {
        return {
          success: false,
          answer:
            "Subject mismatch. You requested help with " +
            subjectUser +
            ", but the question is classified under " +
            subject +
            ".",
          providedQuestion: question,
          detectedSubject: subject,
        };
      }
    }

    // Route to appropriate agent
    try {
      const result = await this.agents[subject].processQuestion(
        question,
        grade,
        explanation,
        steps
      );

      // Build response object conditionally (unchanged)
      let response = {
        success: true,
        subject: subject,
        agent: result.agent,
        grade: result.grade,
        answer: result.answer,
      };

      // Add explanation field only if requested and available (unchanged)
      if (explanation && result.explanation) {
        response.explanation = result.explanation;
      }

      // Add steps field only if requested and available (unchanged)
      if (steps && result.steps) {
        response.steps = result.steps;
      }
      if (userId) {
        // Assume saveAIResponse is defined elsewhere
        await saveAIResponse(userId, {
          question,
          answer: result.answer,
          explanation: result.explanation || null,
          steps: result.steps || null,
          subject,
        });
      }
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Error processing question: ${error.message}`,
        subject: subject,
      };
    }
  }
}


// Initialize Boss Agent
const bossAgent = new BossAgent();

module.exports = bossAgent;
