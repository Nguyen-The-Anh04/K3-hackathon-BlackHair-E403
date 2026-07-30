import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';

const chatHistory = document.querySelector('#chat-history');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const fileInput = document.querySelector('#file-input');
const fileList = document.querySelector('#file-list');
const fileCount = document.querySelector('#file-count');
const fileListEmpty = document.querySelector('#file-list-empty');
const documentsSidebar = document.querySelector('#documents-sidebar');
const toggleFiles = document.querySelector('#toggle-files');
const fileSidebarContent = document.querySelector('#file-sidebar-content');
const fileSidebarBody = document.querySelector('#file-sidebar-body');
const fileName = document.querySelector('#file-name');
const documentLabel = document.querySelector('#document-label');
const slidePreview = document.querySelector('#slide-preview');
const appShell = document.querySelector('#app-shell');
const toggleChat = document.querySelector('#toggle-chat');
const resizeHandle = document.querySelector('#resize-handle');
const toast = document.querySelector('#toast');
let documents = [];
let activeDocument = null;
let currentQuizCard = null;
let toastTimer = null;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

function addMessage(text, isUser = false) {
  const wrapper = document.createElement('div');
  wrapper.className = isUser ? 'flex justify-end' : 'flex justify-start';
  const message = document.createElement('div');
  message.className = isUser
    ? 'max-w-[88%] rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-sm leading-6 text-white shadow-sm'
    : 'max-w-[94%] rounded-2xl rounded-tl-md bg-gray-200 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm';
  message.textContent = text;
  wrapper.appendChild(message);
  chatHistory.appendChild(wrapper);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  return wrapper;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('opacity-100');
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('hidden');
  }, 3000);
}

function requestedQuestionCount(task) {
  const match = task.match(/\b(10|[1-9])\b/);
  return match ? Number(match[1]) : 3;
}

function isQuizRequest(task) {
  const normalized = task.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return ['quiz', 'cau hoi', 'trac nghiem', 'on tap', 'kiem tra', 'mcq'].some((term) => normalized.includes(term));
}

function smallTalkResponse(task) {
  const normalized = task.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  if (/^(ban la ai|ban la gi|ban la mot ai nao)\??$/.test(normalized)) {
    return 'Mình là VLearn Quiz Generator — trợ lý AI giúp bạn tạo câu hỏi trắc nghiệm ôn tập từ nội dung tài liệu bạn tải lên, kèm đáp án, giải thích và trích dẫn nguồn.';
  }
  if (/(dep trai|xinh|ngoai hinh|nhin co dep)/.test(normalized)) {
    return 'Mình chưa nhìn thấy bạn nên không thể đánh giá chính xác, nhưng cách bạn hỏi rất tự tin đó 😄 Mình vẫn có thể giúp bạn tạo quiz từ slide nhé.';
  }
  if (/^(xin chao|chao|hello|hi|hey)\b/.test(normalized)) {
    return 'Chào bạn 😄 Hãy upload slide/PDF rồi gửi yêu cầu để mình tạo câu hỏi ôn tập nhé.';
  }
  if (/(cam on|thank you|thanks)/.test(normalized)) {
    return 'Không có gì 😄 Khi cần ôn tập, bạn chỉ cần chọn tài liệu và gửi yêu cầu tạo quiz.';
  }
  return null;
}

async function readPdf(file) {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ').replace(/\s+/g, ' ').trim();
    if (text) pages.push(`[Trang ${pageNumber}] ${text}`);
  }
  return { pdf, sourceText: pages.join('\n') };
}

function renderFileList() {
  fileList.innerHTML = '';
  fileList.classList.toggle('hidden', documents.length === 0);
  fileListEmpty.classList.toggle('hidden', documents.length > 0);
  fileCount.textContent = `${documents.length} file${documents.length === 1 ? '' : 's'}`;
  documents.forEach((documentItem) => {
    const button = document.createElement('button');
    button.className = `flex w-full items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left text-xs transition ${documentItem === activeDocument ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'}`;
    button.disabled = documentItem.status === 'Đang đọc…';
    button.innerHTML = '<span class="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-100">📄</span><span class="min-w-0"><span class="block truncate font-semibold file-title"></span><span class="block truncate text-[11px] file-status"></span></span>';
    button.querySelector('.file-title').textContent = documentItem.file.name;
    button.querySelector('.file-status').textContent = documentItem.status;
    button.addEventListener('click', () => selectDocument(documentItem));
    fileList.appendChild(button);
  });
}

async function renderPdfPage(pageNumber) {
  if (!activeDocument?.pdf) return false;
  const safePageNumber = Math.min(Math.max(pageNumber, 1), activeDocument.pdf.numPages);
  const page = await activeDocument.pdf.getPage(safePageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const availableWidth = Math.max(slidePreview.clientWidth - 32, 320);
  const availableHeight = Math.max(slidePreview.clientHeight - 72, 240);
  const scale = Math.min(availableWidth / baseViewport.width, availableHeight / baseViewport.height);
  const viewport = page.getViewport({ scale });
  const ratio = window.devicePixelRatio || 1;
  const frame = document.createElement('div');
  frame.className = 'flex min-h-0 flex-1 flex-col items-center justify-center gap-3';
  const canvas = document.createElement('canvas');
  canvas.className = 'max-h-full max-w-full rounded-lg bg-white shadow-sm';
  canvas.width = Math.floor(viewport.width * ratio);
  canvas.height = Math.floor(viewport.height * ratio);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
  frame.appendChild(canvas);
  const controls = document.createElement('div');
  controls.className = 'flex shrink-0 items-center gap-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-md ring-1 ring-slate-200';
  controls.innerHTML = '<button class="pdf-prev rounded-full px-2 py-1 hover:bg-blue-50 hover:text-blue-600">←</button><span class="pdf-page-label"></span><button class="pdf-next rounded-full px-2 py-1 hover:bg-blue-50 hover:text-blue-600">→</button>';
  controls.querySelector('.pdf-page-label').textContent = `Trang ${safePageNumber} / ${activeDocument.pdf.numPages}`;
  controls.querySelector('.pdf-prev').disabled = safePageNumber === 1;
  controls.querySelector('.pdf-next').disabled = safePageNumber === activeDocument.pdf.numPages;
  controls.querySelector('.pdf-prev').addEventListener('click', () => renderPdfPage(safePageNumber - 1));
  controls.querySelector('.pdf-next').addEventListener('click', () => renderPdfPage(safePageNumber + 1));
  slidePreview.innerHTML = '';
  slidePreview.append(frame, controls);
  await page.render({ canvasContext: canvas.getContext('2d'), viewport, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined }).promise;
  return true;
}

async function selectDocument(documentItem) {
  activeDocument = documentItem;
  fileName.textContent = documentItem.file.name;
  documentLabel.textContent = 'Tài liệu đang chọn';
  renderFileList();
  slidePreview.innerHTML = '';
  if (documentItem.pdf) {
    const loading = document.createElement('p');
    loading.className = 'm-auto text-sm text-slate-500';
    loading.textContent = 'Đang hiển thị slide…';
    slidePreview.appendChild(loading);
    await renderPdfPage(1);
    return;
  }
  if (documentItem.file.type.startsWith('image/')) {
    const image = document.createElement('img');
    image.src = documentItem.objectUrl;
    image.alt = `Slide ${documentItem.file.name}`;
    image.className = 'h-full w-full object-contain';
    slidePreview.appendChild(image);
    return;
  }
  const fallback = document.createElement('div');
  fallback.className = 'm-auto text-center';
  fallback.innerHTML = '<div class="mb-3 text-4xl">📄</div><p class="font-semibold text-slate-700"></p><p class="mt-2 text-sm text-slate-500">Đã đọc nội dung file này và sẵn sàng tạo quiz.</p>';
  fallback.querySelector('p').textContent = documentItem.file.name;
  slidePreview.appendChild(fallback);
}

async function addFiles(fileArray) {
  const newDocuments = fileArray.map((file) => ({ file, objectUrl: URL.createObjectURL(file), pdf: null, sourceText: '', status: 'Đang đọc…' }));
  documents.push(...newDocuments);
  if (!activeDocument) activeDocument = newDocuments[0];
  renderFileList();
  await Promise.all(newDocuments.map(async (documentItem) => {
    try {
      if (documentItem.file.type === 'application/pdf' || documentItem.file.name.toLowerCase().endsWith('.pdf')) {
        const result = await readPdf(documentItem.file);
        documentItem.pdf = result.pdf;
        documentItem.sourceText = result.sourceText;
      } else if (documentItem.file.type.startsWith('text/') || /\.(txt|md)$/i.test(documentItem.file.name)) {
        documentItem.sourceText = await documentItem.file.text();
      }
      documentItem.status = documentItem.sourceText ? 'Sẵn sàng tạo quiz' : 'Chưa đọc được chữ';
    } catch (error) {
      documentItem.status = 'Lỗi đọc file';
    }
    renderFileList();
  }));
  await selectDocument(activeDocument);
  showToast(`Đã thêm ${newDocuments.length} file vào danh sách tài liệu.`);
}

function jumpToCitation(citation) {
  const match = String(citation || '').match(/trang\s*(\d+)/i);
  if (!match || !activeDocument?.pdf) return Promise.resolve(false);
  return renderPdfPage(Number(match[1]));
}

function renderQuizCard(questions) {
  if (currentQuizCard) currentQuizCard.remove();
  let questionIndex = 0;
  let selectedIndex = null;
  let score = 0;
  const card = document.createElement('section');
  card.className = 'w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-5';
  currentQuizCard = card;
  const header = document.createElement('div');
  header.className = 'mb-4 flex items-start justify-between gap-3';
  header.innerHTML = '<div><p class="text-xs font-bold uppercase tracking-wider text-blue-600">Quiz ôn tập</p><p class="mt-1 text-xs text-slate-500 quiz-source"></p></div><span class="quiz-progress rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600"></span>';
  header.querySelector('.quiz-source').textContent = `Nguồn: ${activeDocument.file.name}`;
  card.appendChild(header);
  const questionTitle = document.createElement('h3');
  questionTitle.className = 'text-base font-bold leading-6 text-slate-900';
  card.appendChild(questionTitle);
  const options = document.createElement('div');
  options.className = 'mt-4 space-y-2';
  card.appendChild(options);
  const feedback = document.createElement('div');
  feedback.className = 'mt-4 hidden rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600';
  card.appendChild(feedback);
  const actions = document.createElement('div');
  actions.className = 'mt-4 flex items-center justify-between gap-2';
  card.appendChild(actions);

  function drawQuestion() {
    const question = questions[questionIndex];
    selectedIndex = null;
    header.querySelector('.quiz-progress').textContent = `Câu ${questionIndex + 1} / ${questions.length}`;
    questionTitle.textContent = question.text;
    options.innerHTML = '';
    feedback.className = 'mt-4 hidden rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600';
    feedback.textContent = '';
    actions.innerHTML = '';
    const submit = document.createElement('button');
    submit.className = 'w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400';
    submit.textContent = 'Chọn một đáp án';
    submit.disabled = true;
    actions.appendChild(submit);
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'flex w-full items-start rounded-xl border border-slate-200 bg-white px-3 py-3 text-left text-sm transition hover:border-blue-400 hover:bg-blue-50';
      button.innerHTML = `<span class="mr-3 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">${String.fromCharCode(65 + index)}</span>`;
      button.appendChild(document.createTextNode(option));
      button.addEventListener('click', () => {
        selectedIndex = index;
        options.querySelectorAll('button').forEach((item) => item.classList.remove('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-100'));
        button.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-100');
        submit.disabled = false;
        submit.textContent = 'Kiểm tra đáp án';
      });
      options.appendChild(button);
    });
    submit.addEventListener('click', () => {
      if (selectedIndex === null) return;
      const correct = selectedIndex === question.correct;
      if (correct) score += 1;
      options.querySelectorAll('button').forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) button.classList.add('border-emerald-500', 'bg-emerald-50');
        if (index === selectedIndex && !correct) button.classList.add('border-red-500', 'bg-red-50');
      });
      feedback.className = `mt-4 rounded-xl p-3 text-sm leading-6 ${correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`;
      feedback.textContent = `${correct ? 'Chính xác!' : 'Chưa chính xác.'} ${question.explanation || ''}`;
      const citation = question.citation || '[Tài liệu nguồn]';
      const sourceButton = document.createElement('button');
      sourceButton.className = 'mt-2 block font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900';
      sourceButton.textContent = `Nguồn: ${citation}`;
      sourceButton.addEventListener('click', () => {
        jumpToCitation(citation).catch(() => {});
      });
      feedback.appendChild(sourceButton);
      actions.innerHTML = '';
      const next = document.createElement('button');
      next.className = 'w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700';
      next.textContent = questionIndex === questions.length - 1 ? `Hoàn thành · ${score}/${questions.length}` : 'Câu tiếp theo →';
      next.addEventListener('click', () => {
        if (questionIndex === questions.length - 1) { next.textContent = `Đã hoàn thành · ${score}/${questions.length} câu đúng`; next.disabled = true; next.classList.add('bg-emerald-600'); return; }
        questionIndex += 1;
        drawQuestion();
      });
      actions.appendChild(next);
    });
  }
  chatHistory.appendChild(card);
  drawQuestion();
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

fileInput.addEventListener('change', async () => {
  const selectedFiles = Array.from(fileInput.files);
  if (!selectedFiles.length) return;
  await addFiles(selectedFiles);
  fileInput.value = '';
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const task = chatInput.value.trim();
  if (!task) return;
  addMessage(task, true);
  chatInput.value = '';
  const friendlyResponse = smallTalkResponse(task);
  if (friendlyResponse) {
    addMessage(friendlyResponse);
    return;
  }
  if (!isQuizRequest(task)) {
    addMessage('Mình chỉ hỗ trợ tạo câu hỏi trắc nghiệm ôn tập dựa trên tài liệu đang chọn. Hãy thử: “Tạo 3 câu hỏi từ slide này”.');
    return;
  }
  if (!activeDocument || !activeDocument.sourceText.trim()) {
    addMessage('Hãy chọn một file PDF có lớp text hoặc TXT/MD trước. Mình chỉ tạo quiz từ file đang được chọn.');
    return;
  }
  const count = requestedQuestionCount(task);
  const loading = addMessage(`Đang tạo ${count} câu hỏi chỉ từ “${activeDocument.file.name}”…`);
  try {
    const response = await fetch('/api/generate-quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_text: activeDocument.sourceText, task, count }) });
    const data = await response.json();
    loading.remove();
    if (!response.ok) throw new Error(data.error || 'Không thể tạo câu hỏi.');
    if (data.refusal) { addMessage(`Mình chưa tạo quiz: ${data.refusal}`); return; }
    addMessage(`Đã tạo ${data.questions.length} câu hỏi từ “${activeDocument.file.name}”.`);
    renderQuizCard(data.questions);
  } catch (error) {
    loading.remove();
    addMessage(`Không thể tạo quiz: ${error.message}`);
  }
});

toggleChat.addEventListener('click', () => {
  const expanded = appShell.style.getPropertyValue('--chat-width').trim() === '55%';
  appShell.style.setProperty('--chat-width', expanded ? '40%' : '55%');
  toggleChat.textContent = expanded ? 'Mở rộng' : 'Thu nhỏ';
  toggleChat.setAttribute('aria-label', expanded ? 'Mở rộng chatbot' : 'Thu nhỏ chatbot');
});

let resizing = false;
resizeHandle.addEventListener('pointerdown', (event) => {
  resizing = true;
  resizeHandle.setPointerCapture(event.pointerId);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';
  resizeHandle.classList.add('bg-blue-500');
});

resizeHandle.addEventListener('pointermove', (event) => {
  if (!resizing) return;
  const bounds = appShell.getBoundingClientRect();
  const leftWidth = event.clientX - bounds.left;
  const chatWidth = 100 - ((leftWidth / bounds.width) * 100);
  const clampedWidth = Math.min(Math.max(chatWidth, 25), 65);
  appShell.style.setProperty('--chat-width', `${clampedWidth}%`);
  toggleChat.textContent = clampedWidth > 47 ? 'Thu nhỏ' : 'Mở rộng';
});

function stopResizing() {
  if (!resizing) return;
  resizing = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  resizeHandle.classList.remove('bg-blue-500');
}

resizeHandle.addEventListener('pointerup', stopResizing);
resizeHandle.addEventListener('pointercancel', stopResizing);

let filesCollapsed = false;
toggleFiles.addEventListener('click', () => {
  filesCollapsed = !filesCollapsed;
  if (filesCollapsed) {
    documentsSidebar.style.width = '44px';
    documentsSidebar.style.padding = '8px';
    documentsSidebar.classList.add('overflow-hidden');
    fileSidebarContent.classList.add('hidden');
    fileSidebarBody.classList.add('hidden');
    toggleFiles.textContent = '›';
    toggleFiles.setAttribute('aria-label', 'Mở danh sách tài liệu');
  } else {
    documentsSidebar.style.width = '13rem';
    documentsSidebar.style.padding = '12px';
    documentsSidebar.classList.remove('overflow-hidden');
    fileSidebarContent.classList.remove('hidden');
    fileSidebarBody.classList.remove('hidden');
    toggleFiles.textContent = '‹';
    toggleFiles.setAttribute('aria-label', 'Thu gọn danh sách tài liệu');
  }
});
