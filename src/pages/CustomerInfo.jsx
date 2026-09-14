import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './CustomerInfo.module.css';
import SubmitButton from '../components/form/SubmitButton';
import BigButton from '../components/global/BigButton';
import api from '../services/api';

const formatBirthDate = (birthDate) => {
  if (!birthDate) {
    return 'Não informada';
  }

  const parsedDate = new Date(`${birthDate}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return birthDate;
  }

  return parsedDate.toLocaleDateString('pt-BR');
};

function CustomerInfo() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/customers/${id}`);
        setCustomer(response.data);
      } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        setError('Não foi possível carregar as informações do cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return <p className={styles.message}>Carregando...</p>;
  }

  if (error) {
    return <p className={styles.message}>{error}</p>;
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Informações do cliente</h1>

      <dl className={styles.infoList}>
        <div className={styles.infoItem}>
          <dt>Nome</dt>
          <dd>{customer.name || 'Não informado'}</dd>
        </div>
        <div className={styles.infoItem}>
          <dt>Telefone</dt>
          <dd>{customer.phone || 'Não informado'}</dd>
        </div>
        <div className={styles.infoItem}>
          <dt>E-mail</dt>
          <dd>{customer.email || 'Não informado'}</dd>
        </div>
        <div className={styles.infoItem}>
          <dt>Data de nascimento</dt>
          <dd>{formatBirthDate(customer.birthDate)}</dd>
        </div>
        <div className={styles.infoItem}>
          <dt>Observação</dt>
          <dd>{customer.observation || 'Não informada'}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <Link to={`/clientes/editar/${id}`}>
          <BigButton icon="save" name="EDITAR" />
        </Link>
        <Link to={`/anotacoes/${id}`}>
          <SubmitButton text="VOLTAR" customClass="logoffBtn" />
        </Link>
      </div>
    </section>
  );
}

export default CustomerInfo;
