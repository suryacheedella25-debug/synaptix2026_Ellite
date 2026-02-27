function QuestionCard({ question, onAnswer }) {
  return (
    <div>
      <h2>{question.text}</h2>
      {question.options.map((opt, index) => (
        <button key={index} onClick={() => onAnswer(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default QuestionCard;