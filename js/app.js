import { showMessage } from './utils.js';

import {
  createInitialState,
  createSession,
  deleteSessionById,
  editSessionName,
  finishSession,
  updateState,
} from './state.js';

import { render } from './view.js';

const elements = {
  taskName: document.querySelector('#taskName'),
  timerDisplay: document.querySelector('#timerDisplay'),
  timerStatus: document.querySelector('#timerStatus'),
  message: document.querySelector('#message'),
  startBtn: document.querySelector('#startBtn'),
  pauseBtn: document.querySelector('#pauseBtn'),
  resumeBtn: document.querySelector('#resumeBtn'),
  stopBtn: document.querySelector('#stopBtn'),
  searchInput: document.querySelector('#searchInput'),
  sessionsTable: document.querySelector('#sessionsTable'),
  sessionCount: document.querySelector('#sessionCount'),
  totalDuration: document.querySelector('#totalDuration'),
};

let state = createInitialState();

function setState(newState = {}) {
  state = updateState(state, newState);
  render(state, elements);
}

function startTimer() {
  const taskName = elements.taskName.value.trim();

  if (!taskName) {
    showMessage(elements.message, 'Введіть назву роботи перед запуском таймера.', 'error');
    return;
  }

  const currentSession = createSession(taskName);

  const intervalId = setInterval(() => {
    setState({ elapsedSeconds: state.elapsedSeconds + 1 });
  }, 1000);

  showMessage(elements.message, 'Таймер запущено.');

  setState({
    currentSession,
    elapsedSeconds: 0,
    intervalId,
  });
}

function pauseTimer() {
  if (!state.currentSession || !state.intervalId) {
    showMessage(elements.message, 'Немає активного таймера для паузи.', 'error');
    return;
  }

  clearInterval(state.intervalId);
  setState({ intervalId: null });
}

function resumeTimer() {
  if (!state.currentSession) {
    showMessage(elements.message, 'Спочатку запустіть таймер.', 'error');
    return;
  }

  if (state.intervalId) return;

  const intervalId = setInterval(() => {
    setState({ elapsedSeconds: state.elapsedSeconds + 1 });
  }, 1000);

  setState({ intervalId });
}

function stopTimer() {
  if (!state.currentSession) {
    showMessage(elements.message, 'Немає активного сеансу для збереження.', 'error');
    return;
  }

  clearInterval(state.intervalId);

  const sessions = finishSession(state);

  elements.taskName.value = '';
  showMessage(elements.message, 'Сеанс збережено в журналі.');

  setState({
    sessions,
    currentSession: null,
    elapsedSeconds: 0,
    intervalId: null,
  });
}

function deleteSession(id) {
  const sessions = deleteSessionById(state, id);

  showMessage(elements.message, 'Сеанс видалено.');
  setState({ sessions });
}

function editSession(id) {
  const session = state.sessions.find((item) => item.id === id);
  if (!session) return;

  const newName = prompt('Введіть нову назву роботи:', session.taskName);
  if (!newName || !newName.trim()) return;

  const sessions = editSessionName(state, id, newName.trim());

  showMessage(elements.message, 'Назву сеансу змінено.');
  setState({ sessions });
}

function handleTableClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === 'delete') deleteSession(id);
  if (button.dataset.action === 'edit') editSession(id);
}

function handleSearch() {
  setState({ searchQuery: elements.searchInput.value });
}

elements.startBtn.addEventListener('click', startTimer);
elements.pauseBtn.addEventListener('click', pauseTimer);
elements.resumeBtn.addEventListener('click', resumeTimer);
elements.stopBtn.addEventListener('click', stopTimer);
elements.searchInput.addEventListener('input', handleSearch);
elements.sessionsTable.addEventListener('click', handleTableClick);

render(state, elements);