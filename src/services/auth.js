const STORAGE_KEY = 'customy_users';
const SESSION_KEY = 'customy_session';

const defaultUser = {
  name: 'Usuário de Teste',
  document: '00000000000',
  email: 'teste@email.com',
  password: '123456',
};

export const getUsers = () => {
  const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const hasDefaultUser = savedUsers.some(
    (user) => user.email === defaultUser.email,
  );

  return hasDefaultUser ? savedUsers : [defaultUser, ...savedUsers];
};

export const signup = (user) => {
  const users = getUsers();
  const emailAlreadyExists = users.some(
    (savedUser) => savedUser.email.toLowerCase() === user.email.toLowerCase(),
  );

  if (emailAlreadyExists) {
    throw new Error('Já existe uma conta cadastrada com este e-mail.');
  }

  const userToSave = {
    name: user.name,
    document: user.document,
    email: user.email,
    password: user.password,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...users, userToSave]));
  return userToSave;
};

export const login = ({ email, password }) => {
  const user = getUsers().find(
    (savedUser) =>
      savedUser.email.toLowerCase() === email.toLowerCase() &&
      savedUser.password === password,
  );

  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }

  const session = {
    name: user.name,
    email: user.email,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
};

export const isAuthenticated = () => {
  return Boolean(getSession());
};
