import styles from './Customers.module.css';

import Input from '../components/form/Input';
import Customer from '../components/customers_page/Customer';
import AgendaNavbar from '../components/layout/AgendaNavbar';
import BigButton from '../components/global/BigButton';
import ConfirmDialog from '../components/global/ConfirmDialog';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

function Customers() {
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

  return (
    <div className={styles.page}>
      <AgendaNavbar />
      <main className={styles.main}>
        <div className={styles.centralize}>
          <div className={styles.top}>
            <div className={styles.headingRow}>
              <div>
                <h1 className={styles.title}>Clientes</h1>
                <p className={styles.subtitle}>
                  Encontre e gerencie seus clientes
                </p>
              </div>
              <Link className={styles.desktopNewCustomer} to="/clientes/novo">
                <BigButton icon="newCostumer" name="Novo cliente" />
              </Link>
            </div>
            <Input
              type="text"
              name="busca"
              placeholder="Digite o nome do(a) cliente"
              aria-label="Campo de busca"
              value={search}
              handleOnChange={(e) => setSearch(e.target.value)}
              customClass={styles.searchField}
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
          <div className={styles.mobileActions}>
            <Link className={styles.mobileNewCustomer} to="/clientes/novo">
              <BigButton icon="newCostumer" name="Novo cliente" />
            </Link>
          </div>
          {customerToDelete && (
            <ConfirmDialog
              message={`Deseja excluir ${customerToDelete.name} e suas anotações?`}
              onCancel={() => setCustomerToDelete(null)}
              onConfirm={confirmDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Customers;
