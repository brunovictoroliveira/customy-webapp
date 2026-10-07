import api from './api';

const SESSION_KEY = 'customy_session';

const saveSession = ({ token, user }) => {
  const session = { token, ...user };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};

export const signup = async ({ name, document, email, password }) => {
  try {
    const { data } = await api.post('/auth/register', {
      name,
      document,
      email,
      password,
    });

    return saveSession(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Não foi possível criar a conta.'));
  }
};

export const login = async ({ email, password }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return saveSession(data);
  } catch (error) {
    throw new Error(
      getErrorMessage(error, 'Não foi possível entrar na conta.'),
    );
  }
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    logout();
    return null;
  }
};

export const getToken = () => getSession()?.token || null;

export const isAuthenticated = () => Boolean(getToken());
