import { useState } from 'react';
import styles from './forms.module.css';

import Input from '../components/form/Input';
import BigButton from '../components/global/BigButton';
import SubmitButton from '../components/form/SubmitButton';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewCustomer = () => {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    observation: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!customer.name.trim()) {
      setError('O campo Nome é obrigatório.');
      return;
    }

    try {
      await api.post('/customers', customer);
      navigate('/clientes');
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      setError('Erro ao criar cliente. Tente novamente.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Novo cliente</h1>
      <div className={styles.inputs}>
        <Input
          type="text"
          text="Nome"
          name="name"
          placeholder="Digite o nome do(a) cliente"
          value={customer.name}
          handleOnChange={handleChange}
        />
        <Input
          type="tel"
          text="Telefone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={customer.phone}
          handleOnChange={handleChange}
        />
        <Input
          type="email"
          text="E-mail"
          name="email"
          placeholder="example@email.com"
          value={customer.email}
          handleOnChange={handleChange}
        />
        <Input
          type="date"
          text="Data de nascimento"
          name="birthDate"
          value={customer.birthDate}
          handleOnChange={handleChange}
        />
        <Input
          type="textarea"
          text="Observação"
          name="observation"
          placeholder="Digite uma observação"
          value={customer.observation}
          handleOnChange={handleChange}
        />
      </div>
      <div className={styles.buttons}>
        <button type="submit">
          <BigButton icon="save" name="Salvar" />
        </button>
        <Link to="/clientes">
          <SubmitButton text="Voltar" customClass="logoffBtn" />
        </Link>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default NewCustomer;
