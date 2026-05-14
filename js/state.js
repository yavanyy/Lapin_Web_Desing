import StorageService from './storage.js';

export const STORAGE_KEY = 'timetrack_sessions';

export const createInitialState = () => ({
  sessions: StorageService.get(STORAGE_KEY, []),
  currentSession: null,
  elapsedSeconds: 0,
  intervalId: null,
  searchQuery: '',
});

export const updateState = (state, newState = {}) => ({
  ...state,
  ...newState,
});

export const createSession = (taskName) => ({
  id: Date.now(),
  taskName,
  startTime: new Date().toISOString(),
  endTime: null,
  duration: 0,
});

export const saveSessions = (sessions) => {
  StorageService.set(STORAGE_KEY, sessions);
};

export const finishSession = (state) => {
  const finishedSession = {
    ...state.currentSession,
    endTime: new Date().toISOString(),
    duration: state.elapsedSeconds,
  };

  const sessions = [finishedSession, ...state.sessions];
  saveSessions(sessions);

  return sessions;
};

export const deleteSessionById = (state, id) => {
  const sessions = state.sessions.filter((session) => session.id !== id);
  saveSessions(sessions);

  return sessions;
};

export const editSessionName = (state, id, newName) => {
  const sessions = state.sessions.map((session) => (
    session.id === id ? { ...session, taskName: newName } : session
  ));

  saveSessions(sessions);

  return sessions;
};

export const getFilteredSessions = (state) => {
  const query = state.searchQuery.trim().toLowerCase();

  if (!query) return state.sessions;

  return state.sessions.filter((session) => (
    session.taskName.toLowerCase().includes(query)
  ));
};

export const getTotalDuration = (state) => (
  state.sessions.reduce((sum, session) => sum + session.duration, 0)
);