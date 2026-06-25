import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Appointments.module.css';

import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import BigButton from '../components/global/BigButton';
import ConfirmDialog from '../components/global/ConfirmDialog';
import Button from '../components/global/Button';
import api from '../services/api';

const getToday = () => new Date().toISOString().slice(0, 10);

const emptyAppointment = {
  customerId: '',
  date: getToday(),
  time: '',
  description: '',
};

const sortAppointments = (appointments) =>
  [...appointments].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  );

const formatDate = (date) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString('pt-BR');
};

function Appointments() {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState(emptyAppointment);
  const [editingId, setEditingId] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [filters, setFilters] = useState({ customerId: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const customerById = useMemo(
    () =>
      customers.reduce((acc, customer) => {
        acc[String(customer.id)] = customer;
        return acc;
      }, {}),
    [customers],
  );

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((savedAppointment) => {
        const matchesCustomer = filters.customerId
          ? String(savedAppointment.customerId) === String(filters.customerId)
          : true;
        const matchesDate = filters.date
          ? savedAppointment.date === filters.date
          : true;

        return matchesCustomer && matchesDate;
      }),
    [appointments, filters],
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [customersResponse, appointmentsResponse] = await Promise.all([
        api.get('/customers'),
        api.get('/appointments'),
      ]);

      setCustomers(customersResponse.data);
      setAppointments(sortAppointments(appointmentsResponse.data));
    } catch (err) {
      console.error('Erro ao carregar agenda:', err);
      setError('Não foi possível carregar a agenda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const resetForm = () => {
    setAppointment(emptyAppointment);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!appointment.customerId || !appointment.date || !appointment.time) {
      setError('Cliente, data e horário são obrigatórios.');
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/appointments/${editingId}`, {
          ...appointment,
          id: editingId,
        });
        setAppointments((currentAppointments) =>
          sortAppointments(
            currentAppointments.map((currentAppointment) =>
              String(currentAppointment.id) === String(editingId)
                ? response.data
                : currentAppointment,
            ),
          ),
        );
      } else {
        const response = await api.post('/appointments', appointment);
        setAppointments((currentAppointments) =>
          sortAppointments([...currentAppointments, response.data]),
        );
      }

      resetForm();
    } catch (err) {
      console.error('Erro ao salvar agendamento:', err);
      setError('Erro ao salvar agendamento. Tente novamente.');
    }
  };

  const handleEdit = (savedAppointment) => {
    setEditingId(savedAppointment.id);
    setAppointment({
      customerId: String(savedAppointment.customerId),
      date: savedAppointment.date || getToday(),
      time: savedAppointment.time || '',
      description: savedAppointment.description || '',
    });
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) {
      return;
    }

    try {
      await api.delete(`/appointments/${appointmentToDelete.id}`);
      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (currentAppointment) =>
            String(currentAppointment.id) !== String(appointmentToDelete.id),
        ),
      );

      if (String(editingId) === String(appointmentToDelete.id)) {
        resetForm();
      }
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
      setError('Erro ao excluir agendamento. Tente novamente.');
    } finally {
      setAppointmentToDelete(null);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Agenda</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="customerId">
          Cliente
        </label>
        <select
          className={styles.select}
          id="customerId"
          name="customerId"
          value={appointment.customerId}
          onChange={handleChange}
        >
          <option value="">Selecione um cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <Input
          type="date"
          text="Data"
          name="date"
          value={appointment.date}
          handleOnChange={handleChange}
        />
        <Input
          type="time"
          text="Horário"
          name="time"
          value={appointment.time}
          handleOnChange={handleChange}
        />
        <Input
          type="textarea"
          text="Observação"
          name="description"
          placeholder="Detalhes do atendimento"
          value={appointment.description}
          handleOnChange={handleChange}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button type="submit">
            <BigButton icon="save" name={editingId ? 'ATUALIZAR' : 'SALVAR'} />
          </button>
          {editingId && (
            <SubmitButton
              text="CANCELAR EDIÇÃO"
              customClass="logoffBtn"
              onClick={resetForm}
            />
          )}
        </div>
      </form>

      <div className={styles.filters}>
        <label className={styles.label} htmlFor="filterCustomerId">
          Filtrar cliente
        </label>
        <select
          className={styles.select}
          id="filterCustomerId"
          name="customerId"
          value={filters.customerId}
          onChange={handleFilterChange}
        >
          <option value="">Todos os clientes</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <Input
          type="date"
          text="Filtrar data"
          name="date"
          value={filters.date}
          handleOnChange={handleFilterChange}
        />
        <SubmitButton
          text="LIMPAR FILTROS"
          customClass="logoffBtn"
          onClick={() => setFilters({ customerId: '', date: '' })}
        />
      </div>

      <div className={styles.appointmentsList}>
        {loading ? (
          <p>Carregando...</p>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((savedAppointment) => (
            <div className={styles.appointment} key={savedAppointment.id}>
              <strong>
                {formatDate(savedAppointment.date)} às {savedAppointment.time}
              </strong>
              <span>
                {customerById[String(savedAppointment.customerId)]?.name ||
                  'Cliente não encontrado'}
              </span>
              {savedAppointment.description && (
                <span>{savedAppointment.description}</span>
              )}
              <div className={styles.appointmentActions}>
                <Button
                  type="EditButton"
                  title="Editar agendamento"
                  onClick={() => handleEdit(savedAppointment)}
                />
                <Button
                  type="DeleteButton"
                  title="Excluir agendamento"
                  onClick={() => setAppointmentToDelete(savedAppointment)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>Nenhum agendamento encontrado.</p>
        )}
      </div>

      <div className={styles.buttons}>
        <Link to="/customers">
          <SubmitButton text="VOLTAR" customClass="logoffBtn" />
        </Link>
      </div>
      {appointmentToDelete && (
        <ConfirmDialog
          message="Deseja excluir este agendamento?"
          onCancel={() => setAppointmentToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}

export default Appointments;
