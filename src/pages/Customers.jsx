import styles from './Customers.module.css';

import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import Customer from '../components/customers_page/Customer';
import Container from '../components/layout/Container';
import BigButton from '../components/global/BigButton';
import ConfirmDialog from '../components/global/ConfirmDialog';

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { logout } from '../services/auth';

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()),
  );

  const confirmDelete = async () => {
    if (!customerToDelete) {
      return;
    }

    try {
      const notesResponse = await api.get(
        `/notes?customerId=${customerToDelete.id}`,
      );
      await Promise.all(
        notesResponse.data.map((note) => api.delete(`/notes/${note.id}`)),
      );
      await api.delete(`/customers/${customerToDelete.id}`);
      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) => String(customer.id) !== String(customerToDelete.id),
        ),
      );
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError('Erro ao excluir cliente. Tente novamente.');
    } finally {
      setCustomerToDelete(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container>
      <div className={styles.centralize}>
        <div className={styles.top}>
          <h1 className={styles.title}>Clientes</h1>
          <Input
            type="text"
            name="busca"
            placeholder="Digite o nome do(a) cliente"
            aria-label="Campo de busca"
            value={search}
            handleOnChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.customersList}>
          {loading ? (
            <p>Carregando...</p>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <Customer
                key={customer.id}
                id={customer.id}
                name={customer.name}
                onDelete={(id, name) => setCustomerToDelete({ id, name })}
              />
            ))
          ) : (
            <p className={styles.empty}>Nenhum cliente encontrado.</p>
          )}
        </div>
        <div className={styles.buttons}>
          <Link to="/customers/new">
            <BigButton icon="newCostumer" name="NOVO CLIENTE" />
          </Link>
          <Link to="/appointments">
            <BigButton icon="calendar" name="AGENDA" />
          </Link>
          <SubmitButton
            text="DESLOGAR"
            customClass="logoffBtn"
            onClick={handleLogout}
          />
        </div>
        {customerToDelete && (
          <ConfirmDialog
            message={`Deseja excluir ${customerToDelete.name} e suas anotações?`}
            onCancel={() => setCustomerToDelete(null)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </Container>
  );
}

export default Customers;
