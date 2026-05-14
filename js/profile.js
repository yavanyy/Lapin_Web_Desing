import StorageService from './storage.js';
import { formatDate, formatDuration } from './utils.js';

const USER_KEY = 'timetrack_user';
const CURRENT_USER_KEY = 'timetrack_current_user';
const SESSIONS_KEY = 'timetrack_sessions';

const $ = (selector) => document.querySelector(selector);

const state = {
  user: StorageService.get(USER_KEY, null),
  currentUser: StorageService.get(CURRENT_USER_KEY, null),
  sessions: StorageService.get(SESSIONS_KEY, []),
};

const isAuthorized = () => Boolean(state.user && state.currentUser === state.user.email);

const getTotalDuration = () => state.sessions.reduce((sum, session) => sum + session.duration, 0);

const getProfileRows = () => [
  ['Ім’я', state.user.name],
  ['Email', state.user.email],
  ['Стать', state.user.gender],
  ['Дата народження', formatDate(state.user.birthDate)],
  ['Кількість робочих сеансів', state.sessions.length],
  ['Загальний облікований час', formatDuration(getTotalDuration())],
];

const renderEmptyProfile = () => {
  $('#profileTable').innerHTML = `
    <tr>
      <td class="p-4 text-center text-slate-500">
        Користувача не знайдено. Спочатку зареєструйтесь або увійдіть.
      </td>
    </tr>
  `;
};

const renderProfile = () => {
  if (!isAuthorized()) {
    renderEmptyProfile();
    return;
  }

  $('#profileTable').innerHTML = getProfileRows().map(([label, value]) => `
    <tr>
      <th class="text-left bg-slate-100 p-4 w-1/3">${label}</th>
      <td class="p-4">${value}</td>
    </tr>
  `).join('');
};

const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'login.html';
};

$('#logoutBtn')?.addEventListener('click', logout);
renderProfile();
