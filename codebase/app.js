const questions = [
  {
    text: "Self-attention giúp mô hình làm gì?",
    options: [
      "Xác định mức độ liên quan giữa các token",
      "Xoá toàn bộ token không quan trọng",
      "Chuyển văn bản thành hình ảnh",
      "Đo tốc độ mạng của ứng dụng"
    ],
    correct: 0,
    explanation: "Self-attention cho phép mô hình tập trung vào những token liên quan khi tạo biểu diễn cho token hiện tại.",
    citation: "Nguồn: Transcript bài giảng [T04-032]"
  },
  {
    text: "Ba vector nào được tạo cho mỗi token trong cơ chế attention?",
    options: ["Query, Key và Value", "Input, Output và Loss", "Train, Test và Valid", "Prompt, Tool và Agent"],
    correct: 0,
    explanation: "Mỗi token được biểu diễn qua Query, Key và Value; các vector này giúp tính mức độ liên quan và tổng hợp thông tin.",
    citation: "Nguồn: Transcript bài giảng [T04-033]"
  },
  {
    text: "Mô hình dùng thông tin attention để quyết định điều gì?",
    options: ["Nên tập trung vào token nào", "Nên đổi tên bài học", "Nên xoá citation", "Nên tắt toàn bộ context"],
    correct: 0,
    explanation: "Attention cung cấp tín hiệu để mô hình biết token nào có liên quan hơn trong ngữ cảnh hiện tại.",
    citation: "Nguồn: Transcript bài giảng [T04-034]"
  }
];

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;

const screens = {
  material: document.querySelector('#screen-material'),
  setup: document.querySelector('#screen-setup'),
  quiz: document.querySelector('#screen-quiz'),
  feedback: document.querySelector('#screen-feedback'),
  result: document.querySelector('#screen-result')
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetQuiz() {
  currentQuestion = 0;
  selectedAnswer = null;
  score = 0;
}

function renderQuestion() {
  const question = questions[currentQuestion];
  selectedAnswer = null;
  document.querySelector('#progress-label').textContent = `CÂU ${currentQuestion + 1} / ${questions.length}`;
  document.querySelector('#progress-bar').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  document.querySelector('#question-number').textContent = String(currentQuestion + 1).padStart(2, '0');
  document.querySelector('#quiz-title').textContent = question.text;
  document.querySelector('#submit-answer').disabled = true;
  document.querySelector('#submit-answer').textContent = 'Chọn một đáp án';
  document.querySelector('#options').innerHTML = question.options.map((option, index) => `
    <button class="option" data-index="${index}" role="radio" aria-checked="false">
      <span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span>
    </button>
  `).join('');
  document.querySelectorAll('.option').forEach((option) => option.addEventListener('click', () => selectOption(option)));
}

function selectOption(option) {
  selectedAnswer = Number(option.dataset.index);
  document.querySelectorAll('.option').forEach((item) => {
    const isSelected = item === option;
    item.classList.toggle('selected', isSelected);
    item.setAttribute('aria-checked', String(isSelected));
  });
  const submit = document.querySelector('#submit-answer');
  submit.disabled = false;
  submit.textContent = 'Kiểm tra đáp án →';
}

function showFeedback() {
  const question = questions[currentQuestion];
  const correct = selectedAnswer === question.correct;
  if (correct) score += 1;
  const card = document.querySelector('#feedback-card');
  card.classList.toggle('incorrect', !correct);
  document.querySelector('#feedback-icon').textContent = correct ? '✓' : '×';
  document.querySelector('#feedback-status').textContent = correct ? 'Chính xác' : 'Chưa chính xác';
  document.querySelector('#feedback-title').textContent = correct ? 'Bạn đã chọn đúng!' : 'Đáp án cần xem lại';
  document.querySelector('#feedback-answer').textContent = `Đáp án đúng: ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}`;
  document.querySelector('#feedback-explanation').textContent = question.explanation;
  document.querySelector('#feedback-citation').textContent = question.citation;
  document.querySelector('#next-question').innerHTML = currentQuestion === questions.length - 1 ? 'Xem kết quả <span>→</span>' : 'Câu tiếp theo <span>→</span>';
  showScreen('feedback');
}

function showResult() {
  document.querySelector('#score-number').textContent = score;
  document.querySelector('#result-message').textContent = score === questions.length ? 'Tuyệt vời! Bạn đã nắm được các ý chính của đoạn học.' : 'Hãy xem lại phần giải thích và thử làm lại để củng cố kiến thức.';
  showScreen('result');
}

document.querySelector('#start-quiz').addEventListener('click', () => showScreen('setup'));
document.querySelector('#begin-quiz').addEventListener('click', () => { resetQuiz(); renderQuestion(); showScreen('quiz'); });
document.querySelector('#submit-answer').addEventListener('click', showFeedback);
document.querySelector('#next-question').addEventListener('click', () => {
  if (currentQuestion < questions.length - 1) { currentQuestion += 1; renderQuestion(); showScreen('quiz'); } else showResult();
});
document.querySelector('#retry-quiz').addEventListener('click', () => { resetQuiz(); renderQuestion(); showScreen('quiz'); });
document.querySelectorAll('[data-target]').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.target)));
