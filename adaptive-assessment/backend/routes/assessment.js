const express = require("express");
const router = express.Router();
const { getNextDifficulty } = require("../adaptiveEngine");
const questions = require("../../data/questions.json");

let sessions = {};

router.post("/start", (req, res) => {
  const sessionId = Date.now().toString();
  sessions[sessionId] = { difficulty: "medium" };

  const question = questions.find(q => q.difficulty === "medium");

  res.json({ sessionId, question });
});

router.post("/answer", (req, res) => {
  const { sessionId, questionId, selected } = req.body;
  const session = sessions[sessionId];

  const question = questions.find(q => q.id === questionId);
  const isCorrect = question.answer === selected;

  session.difficulty = getNextDifficulty(session.difficulty, isCorrect);

  const nextQuestion = questions.find(
    q => q.difficulty === session.difficulty
  );

  res.json({ nextQuestion });
});

module.exports = router;