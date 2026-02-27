import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionCard from "./QuestionCard";

function Assessment() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    axios.post("http://localhost:5000/start")
      .then(res => {
        setSessionId(res.data.sessionId);
        setQuestion(res.data.question);
      });
  }, []);

  const handleAnswer = (selected) => {
    axios.post("http://localhost:5000/answer", {
      sessionId,
      questionId: question.id,
      selected
    }).then(res => {
      setQuestion(res.data.nextQuestion);
    });
  };

  return (
    <div>
      {question && (
        <QuestionCard question={question} onAnswer={handleAnswer} />
      )}
    </div>
  );
}

export default Assessment;