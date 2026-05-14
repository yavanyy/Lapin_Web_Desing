import {
  formatDate,
  formatDuration,
  formatTime,
  formatTimer,
} from './utils.js';

import {
  getFilteredSessions,
  getTotalDuration,
} from './state.js';

export function render(state, elements) {
  renderTimer(state, elements);
  renderSessions(state, elements);
}

function renderTimer(state, elements) {
  elements.timerDisplay.textContent = formatTimer(state.elapsedSeconds);

  let statusText = 'таймер не запущено';
  let statusColor = 'text-slate-600';

  if (state.currentSession && state.intervalId) {
    statusText = 'таймер запущено';
    statusColor = 'text-green-600';
  } else if (state.currentSession && !state.intervalId) {
    statusText = 'таймер призупинено';
    statusColor = 'text-yellow-700';
  }

  elements.timerStatus.textContent = `Статус: ${statusText}`;
  elements.timerStatus.className = `mt-3 text-sm font-medium ${statusColor}`;

  elements.startBtn.disabled = Boolean(state.currentSession);
  elements.pauseBtn.disabled = !state.currentSession || !state.intervalId;
  elements.resumeBtn.disabled = !state.currentSession || Boolean(state.intervalId);
  elements.stopBtn.disabled = !state.currentSession;
}

function renderSessions(state, elements) {
  const sessions = getFilteredSessions(state);

  elements.sessionCount.textContent = state.sessions.length;
  elements.totalDuration.textContent = formatDuration(getTotalDuration(state));

  if (sessions.length === 0) {
    elements.sessionsTable.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-500">Поки що немає збережених сеансів</td></tr>';
    return;
  }

  elements.sessionsTable.innerHTML = sessions.map((session) => `
    <tr>
      <td class="p-3 font-medium">${session.taskName}</td>
      <td class="p-3 text-slate-500">${formatDate(session.startTime)}</td>
      <td class="p-3">${formatTime(session.startTime)}</td>
      <td class="p-3">${formatTime(session.endTime)}</td>
      <td class="p-3 font-medium text-blue-700">${formatDuration(session.duration)}</td>
      <td class="p-3">
        <div class="flex flex-wrap gap-2">
          <button data-action="edit" data-id="${session.id}" class="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700">Редагувати</button>
          <button data-action="delete" data-id="${session.id}" class="px-3 py-1 rounded-lg bg-red-100 text-red-700">Видалити</button>
        </div>
      </td>
    </tr>
  `).join('');
}