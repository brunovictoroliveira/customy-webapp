import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import { isTransientLoginError, login } from '../services/auth';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setConnecting(true);
    try {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          await login(formData);
          navigate('/agenda');
          return;
        } catch (err) {
          if (!isTransientLoginError(err) || attempt === 2) throw err;
          await sleep(1500);
        }
      }
    } catch (err) {
      setError(isTransientLoginError(err)
        ? 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
        : err.message);
    } finally {
      setConnecting(false);
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

            {connecting && <p role="status" className={styles.status}>Conectando ao servidor. Aguarde…</p>}
            {error && <p role="alert" className={styles.error}>{error}</p>}

            <SubmitButton
              text="Fazer login"
              type="submit"
              className="interBold"
              disabled={connecting}
              text={connecting ? 'Conectando…' : 'Fazer login'}
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
