import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import { signup } from '../services/auth';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    emailConfirmation: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const hasEmptyField = Object.values(formData).some(
      (value) => !value.trim(),
    );

    if (hasEmptyField) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (formData.email !== formData.emailConfirmation) {
      setError('Os e-mails informados precisam ser iguais.');
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas informadas precisam ser iguais.');
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        'A senha deve ter 8 caracteres, com maiúscula, minúscula, número e caractere especial.',
      );
      return;
    }

    try {
      signup(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.logo}></div>

        <Input
          type="text"
          text="Nome ou empresa"
          name="name"
          placeholder="Digite seu nome ou empresa"
          value={formData.name}
          handleOnChange={handleChange}
        />

        <Input
          type="text"
          text="CPF ou CNPJ"
          name="document"
          placeholder="Digite seu documento"
          value={formData.document}
          handleOnChange={handleChange}
        />

        <Input
          type="email"
          text="Digite seu e-mail"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          handleOnChange={handleChange}
        />

        <Input
          type="email"
          text="Digite o e-mail novamente"
          name="emailConfirmation"
          placeholder="example@email.com"
          value={formData.emailConfirmation}
          handleOnChange={handleChange}
        />

        <Input
          type="password"
          text="Crie uma senha"
          name="password"
          placeholder="Digite sua senha"
          value={formData.password}
          handleOnChange={handleChange}
        />

        <Input
          type="password"
          text="Digite a senha novamente"
          name="passwordConfirmation"
          placeholder="Digite sua senha"
          value={formData.passwordConfirmation}
          handleOnChange={handleChange}
        />

        {error && <p className={styles.error}>{error}</p>}

        <SubmitButton text="REGISTRAR" customClass="btn" type="submit" />

        <Link to="/">
          <SubmitButton text="VOLTAR" customClass="logoffBtn" />
        </Link>
      </form>
    </section>
  );
}

export default Signup;
