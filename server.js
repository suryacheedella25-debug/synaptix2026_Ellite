const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const questionBank = {
  python: [
    { question: "Which keyword defines a function?", options: ["func", "define", "def", "function"], answer: "def", topic: "Functions", difficulty: "easy" },
    { question: "What is a list?", options: ["Immutable", "Mutable", "Tuple", "Set"], answer: "Mutable", topic: "Lists", difficulty: "medium" },
    { question: "What is lambda?", options: ["Loop", "Anonymous function", "Class", "Module"], answer: "Anonymous function", topic: "Functions", difficulty: "hard" }
  ],
  java: [
    { question: "Java is platform independent?", options: ["Yes", "No", "Sometimes", "None"], answer: "Yes", topic: "Basics", difficulty: "easy" },
    { question: "What is inheritance?", options: ["Loop", "Class property", "Object copying", "None"], answer: "Class property", topic: "OOP", difficulty: "medium" },
    { question: "JVM stands for?", options: ["Java Variable Machine", "Java Virtual Machine", "Java Visual Model", "None"], answer: "Java Virtual Machine", topic: "Core", difficulty: "hard" }
  ],
  c: [
    { question: "C is procedural language?", options: ["Yes", "No", "Maybe", "None"], answer: "Yes", topic: "Basics", difficulty: "easy" },
    { question: "What is pointer?", options: ["Loop", "Address variable", "Array", "None"], answer: "Address variable", topic: "Pointers", difficulty: "medium" },
    { question: "malloc is used for?", options: ["Loop", "Dynamic Memory", "Function", "None"], answer: "Dynamic Memory", topic: "Memory", difficulty: "hard" }
  ]
};

app.get("/question/:lang/:difficulty", (req, res) => {
  const { lang, difficulty } = req.params;
  const filtered = questionBank[lang].filter(q => q.difficulty === difficulty);
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  res.json(random);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));