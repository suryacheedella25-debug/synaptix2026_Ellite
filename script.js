let time = 0;
let timer = setInterval(() => {
  time++;
  document.getElementById("time").innerText = time;
}, 1000);

async function loadQuestion() {
  const lang = localStorage.getItem("language");
  const difficulty = localStorage.getItem("difficulty");

  const res = await fetch(`/question/${lang}/${difficulty}`);
  const data = await res.json();

  window.currentQuestion = data;

  document.getElementById("question").innerText = data.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  data.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  let score = parseInt(localStorage.getItem("score"));
  let difficulty = localStorage.getItem("difficulty");
  let count = parseInt(localStorage.getItem("count"));
  let topicData = JSON.parse(localStorage.getItem("topicData"));

  const correct = window.currentQuestion.answer;
  const topic = window.currentQuestion.topic;

  if (!topicData[topic]) topicData[topic] = { correct: 0, total: 0 };
  topicData[topic].total++;

  if (selected === correct) {
    score++;
    topicData[topic].correct++;

    if (time < 15 && difficulty === "medium") difficulty = "hard";
    else if (difficulty === "easy") difficulty = "medium";
  } else {
    if (difficulty === "hard") difficulty = "medium";
    else if (difficulty === "medium") difficulty = "easy";
  }

  count++;
  localStorage.setItem("score", score);
  localStorage.setItem("difficulty", difficulty);
  localStorage.setItem("count", count);
  localStorage.setItem("topicData", JSON.stringify(topicData));

  if (count >= 10) {
    window.location.href = "result.html";
  } else {
    time = 0;
    loadQuestion();
  }
}

loadQuestion();