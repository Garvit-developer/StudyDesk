const { body } = require("express-validator");


exports.askAIValidation = [
  body('question')
    .notEmpty()
    .withMessage('Question is required')
     .isString()
    .withMessage('Question must be a string'),

  body('grade')
    .notEmpty()
    .withMessage('Grade is required')
    .isString()
    .withMessage('Grade must be a string'),

  body('subjectUser')
    .notEmpty()
    .withMessage('subject is required')
    .isString()
    .withMessage(' subject must be a string'),
];