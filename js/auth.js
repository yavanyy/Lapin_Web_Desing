import StorageService from './storage.js';
import { showMessage } from './utils.js';

const USER_KEY = 'timetrack_user';
const CURRENT_USER_KEY = 'timetrack_current_user';

const $ = (selector) => document.querySelector(selector);
const goToProfile = () => setTimeout(() => {
  window.location.href = 'profile.html';
}, 700);

const getRegisterData = () => ({
  name: $('#name').value.trim(),
  email: $('#email').value.trim(),
  gender: $('#gender').value,
  birthDate: $('#birthDate').value,
  password: $('#password').value.trim(),
});

const getLoginData = () => ({
  email: $('#loginEmail').value.trim(),
  password: $('#loginPassword').value.trim(),
});

const isFilled = (data) => Object.values(data).every(Boolean);

const saveCurrentUser = (user) => {
  StorageService.set(USER_KEY, user);
  StorageService.set(CURRENT_USER_KEY, user.email);
};

const handleRegister = (event) => {
  event.preventDefault();
  const user = getRegisterData();
  const message = $('#registerMessage');

  if (!isFilled(user)) {
    showMessage(message, 'Заповніть усі поля реєстрації.', 'error');
    return;
  }

  saveCurrentUser(user);
  showMessage(message, 'Реєстрацію виконано успішно. Переходимо до профілю.');
  goToProfile();
};

const handleLogin = (event) => {
  event.preventDefault();
  const { email, password } = getLoginData();
  const message = $('#loginMessage');
  const user = StorageService.get(USER_KEY, null);

  if (!email || !password) {
    showMessage(message, 'Введіть email і пароль.', 'error');
    return;
  }

  if (!user || user.email !== email || user.password !== password) {
    showMessage(message, 'Неправильний email або пароль.', 'error');
    return;
  }

  StorageService.set(CURRENT_USER_KEY, email);
  showMessage(message, 'Вхід виконано успішно.');
  goToProfile();
};

$('#registerForm')?.addEventListener('submit', handleRegister);
$('#loginForm')?.addEventListener('submit', handleLogin);
