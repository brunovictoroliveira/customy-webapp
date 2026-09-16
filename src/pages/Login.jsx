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
      navigate('/agenda');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.heroblock}>
        <div className={styles.logo}></div>
        <div className="interBold">
          <h1>
            Aqui você <span className={styles.lightblue}>armazena </span>
            sua lista de <span className={styles.pink}>clientes</span>, faz{' '}
            <span className={styles.yellow}>anotações </span>e organiza sua{' '}
            <span className={styles.lightred}>agenda</span>, tudo{' '}
            <span className={styles.blue}>em um só lugar</span>
          </h1>
        </div>
      </section>
      <section>
        <div className={styles.loginForm}>
          <h1 className={'interBold'}>Já possui conta?</h1>
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              text="Digite seu e-mail cadastrado"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              handleOnChange={handleChange}
            />

            <Input
              type="password"
              text="Digite sua senha"
              name="password"
              placeholder=""
              value={formData.password}
              handleOnChange={handleChange}
            />

            {error && <p className={styles.error}>{error}</p>}

            <SubmitButton
              text="Fazer login"
              type="submit"
              className="interBold"
            />

            <Link to="/">
              <p className={styles.recoverPass}>Esqueci minha senha</p>
            </Link>
          </form>

          <h1 className={'interBold'}>Primeiro acesso?</h1>
          <Link to="/cadastro">
            <SubmitButton
              text="Registrar-se"
              customClass="signupBtn"
              className="interBold"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
