import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './forms.module.css';

import Input from '../components/form/Input';
import BigButton from '../components/global/BigButton';
import SubmitButton from '../components/form/SubmitButton';
import api from '../services/api';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    observation: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/customers/${id}`)
      .then((response) => {
        setCustomer({
          name: response.data.name || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          birthDate: response.data.birthDate || '',
          observation: response.data.observation || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar cliente:', err);
        setError('Não foi possível carregar os dados do cliente.');
        setLoading(false);
      });
  }, [id]);

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
      await api.patch(`/customers/${id}`, customer);
      navigate(`/anotacoes/${id}`);
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      setError('Erro ao atualizar o cliente. Tente novamente.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Editar cliente</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error && !customer.name ? (
        <p className={styles.error}>{error}</p>
      ) : (
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
      )}
      <div className={styles.buttons}>
        <button type="submit" disabled={loading}>
          <BigButton icon="save" name="SALVAR" />
        </button>
        <Link to={`/anotacoes/${id}`}>
          <SubmitButton text="VOLTAR" customClass="logoffBtn" />
        </Link>
      </div>
      {error && customer.name && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default EditCustomer;
