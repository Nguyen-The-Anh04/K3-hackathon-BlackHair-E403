const sampleMaterial = `
[Trang 1] Self-attention cho phép mô hình xác định mức độ liên quan giữa các token trong cùng một câu. Mỗi token tạo ra ba vector: Query, Key và Value.
[Trang 1] Thông qua các vector này, mô hình quyết định nên tập trung vào những token nào khi tạo biểu diễn cho token hiện tại.
[Trang 2] Attention giúp mô hình giữ lại thông tin quan trọng trong ngữ cảnh thay vì xử lý mọi token với mức độ quan trọng như nhau.
`;

let questions = [];
let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;

const screens = {
  material: document.querySelector('#screen-material'), setup: document.querySelector('#screen-setup'),
  quiz: document.querySelector('#screen-quiz'), feedback: document.querySelector('#screen-feedback'), result: document.querySelector('#screen-result')
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setAiStatus(message, isError = false) {
  ['#ai-status', '#setup-ai-status'].forEach((selector) => {
    const status = document.querySelector(selector);
    status.textContent = message;
    status.style.color = isError ? '#c74343' : '';
  });
}

async function generateQuiz() {
  const button = document.querySelector('#begin-quiz');
  const task = document.querySelector('#labcoach-request').value.trim();
  if (!task) { setAiStatus('Hãy nhập yêu cầu kiểm thử trước khi bắt đầu.', true); return; }
  button.disabled = true;
  button.textContent = 'AI đang tạo câu hỏi…';
  setAiStatus('Đang gọi AI thật và kiểm tra nội dung trả về…');
  try {
    const response = await fetch('/api/generate-quiz', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_text: sampleMaterial, task, count: 3 })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Không thể tạo câu hỏi.');
    if (data.refusal) {
      setAiStatus(`AI từ chối yêu cầu: ${data.refusal}`, true);
      return;
    }
    questions = data.questions;
    resetQuiz(); renderQuestion();
    setAiStatus(`Đã tạo ${questions.length} câu bằng ${data.model}.`);
    showScreen('quiz');
  } catch (error) {
    setAiStatus(`Lỗi: ${error.message} Hãy chạy server và kiểm tra GEMINI_API_KEY.`, true);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Bắt đầu làm bài <span>→</span>';
  }
}

function resetQuiz() { currentQuestion = 0; selectedAnswer = null; score = 0; }

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
    <button class="option" data-index="${index}" role="radio" aria-checked="false"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>
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
  submit.disabled = false; submit.textContent = 'Kiểm tra đáp án →';
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
document.querySelector('#begin-quiz').addEventListener('click', generateQuiz);
document.querySelector('#submit-answer').addEventListener('click', showFeedback);
document.querySelector('#next-question').addEventListener('click', () => {
  if (currentQuestion < questions.length - 1) { currentQuestion += 1; renderQuestion(); showScreen('quiz'); } else showResult();
});
document.querySelector('#retry-quiz').addEventListener('click', () => { resetQuiz(); renderQuestion(); showScreen('quiz'); });
document.querySelectorAll('[data-target]').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.target)));
