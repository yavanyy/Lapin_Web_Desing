export const formatTimer = (seconds) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
};

export const formatDate = (dateString) => new Date(dateString).toLocaleDateString('uk-UA');

export const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('uk-UA', {
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds} сек`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) return `${minutes} хв`;
  if (minutes === 0) return `${hours} год`;
  return `${hours} год ${minutes} хв`;
};

export const showMessage = (element, text, type = 'success') => {
  element.textContent = text;
  element.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'bg-red-50', 'text-red-700');

  if (type === 'error') {
    element.classList.add('bg-red-50', 'text-red-700');
  } else {
    element.classList.add('bg-green-50', 'text-green-700');
  }
};
