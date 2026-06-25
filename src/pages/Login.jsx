import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import { login } from '../services/auth';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className={styles.loginForm}>
        <div className={styles.logo}></div>

        <form onSubmit={handleLogin}>
          <Input
            type="email"
            text="E-mail"
            name="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            handleOnChange={handleChange}
          />

          <Input
            type="password"
            text="Senha"
            name="password"
            placeholder="Digite sua senha"
            value={formData.password}
            handleOnChange={handleChange}
          />

          {error && <p className={styles.error}>{error}</p>}

          <SubmitButton text="LOGIN" type="submit" />
        </form>

        <span>Não tem uma conta?</span>

        <Link to="/signup">
          <SubmitButton text="REGISTRE-SE" customClass="signupBtn" />
        </Link>

        <span className={styles.recoverPass}>Esqueci minha senha</span>
      </div>
    </section>
  );
}

export default Login;
