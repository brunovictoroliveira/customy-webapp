import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Appointments.module.css';

import AgendaNavbar from '../components/layout/AgendaNavbar';
import api from '../services/api';
import arrowLeft from '../assets/icons/arrow-left-s-line.svg';
import arrowRight from '../assets/icons/arrow-right-s-line.svg';
import pencilIcon from '../assets/icons/pencil-line.svg';
import searchIcon from '../assets/icons/search-line.svg';

const WEEK_DAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const WEEK_DAYS_LONG = [
  'DOMINGO',
  'SEGUNDA-FEIRA',
  'TERÇA-FEIRA',
  'QUARTA-FEIRA',
  'QUINTA-FEIRA',
  'SEXTA-FEIRA',
  'SÁBADO',
];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const VIEWS = [
  { id: 'day', label: 'Dia' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'year', label: 'Ano' },
];
const COLORS = [
  { value: '#24b7f2', soft: '#c9edfb', text: '#0074a3' },
  { value: '#ff174f', soft: '#fac8d4', text: '#b7002f' },
  { value: '#24e99a', soft: '#c2f6e1', text: '#008657' },
  { value: '#9847ef', soft: '#e5d1fa', text: '#5e00bd' },
  { value: '#ff7a00', soft: '#ffddbd', text: '#a54f00' },
  { value: '#ffd446', soft: '#fff0b8', text: '#8a6900' },
];
const END_HOUR = 24;
const INITIAL_HOUR = 7;
const GRID_CHROME_HEIGHT = 174;

const getHourHeight = () =>
  Math.max(52, Math.round((window.innerHeight - GRID_CHROME_HEIGHT) / 10));

const pad = (value) => String(value).padStart(2, '0');
const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromDateKey = (value) => {
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};
const getToday = () => toDateKey(new Date());
const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};
const addMonths = (date, amount) => {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + amount);
  return result;
};
const startOfWeek = (date) => addDays(date, -date.getDay());
const timeToMinutes = (time = '00:00') => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};
const addMinutesToTime = (time, amount) => {
  const total = Math.min(timeToMinutes(time) + amount, 23 * 60 + 59);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};
const displayTime = (time = '') => time.replace(/^0/, '');
const formatDate = (date) =>
  fromDateKey(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
const sortAppointments = (items) =>
  [...items].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  );
const getColor = (appointment, index = 0) =>
  COLORS.find((color) => color.value === appointment.color) ||
  COLORS[index % COLORS.length];
const normalizeAppointment = (appointment, index) => ({
  ...appointment,
  endTime: appointment.endTime || addMinutesToTime(appointment.time, 60),
  color: appointment.color || COLORS[index % COLORS.length].value,
});

function IconButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={onClick}
      aria-label={label}
    >
      <img src={icon} alt="" />
    </button>
  );
}

function MiniCalendar({
  displayedMonth,
  selectedDate,
  onMonthChange,
  onSelectDate,
}) {
  const firstDay = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth(),
    1,
    12,
  );
  const gridStart = addDays(firstDay, -firstDay.getDay());
  const days = Array.from({ length: 42 }, (_, index) =>
    addDays(gridStart, index),
  );
  const today = getToday();

  return (
    <section className={styles.miniCalendar} aria-label="Calendário mensal">
      <div className={styles.miniHeader}>
        <h1>
          {MONTHS[displayedMonth.getMonth()]} {displayedMonth.getFullYear()}
        </h1>
        <div>
          <IconButton
            icon={arrowLeft}
            label="Mês anterior"
            onClick={() => onMonthChange(-1)}
          />
          <IconButton
            icon={arrowRight}
            label="Próximo mês"
            onClick={() => onMonthChange(1)}
          />
        </div>
      </div>
      <div className={styles.miniWeekDays}>
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.miniDays}>
        {days.map((day) => {
          const key = toDateKey(day);
          return (
            <button
              type="button"
              key={key}
              className={`${day.getMonth() !== displayedMonth.getMonth() ? styles.outsideMonth : ''} ${
                key === today ? styles.today : ''
              } ${key === selectedDate ? styles.selectedMiniDay : ''}`}
              onClick={() => onSelectDate(day)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AppointmentList({ appointments, onDoubleClick }) {
  const grouped = appointments.reduce((groups, appointment, index) => {
    const item = { ...appointment, colorConfig: getColor(appointment, index) };
    groups[item.date] = [...(groups[item.date] || []), item];
    return groups;
  }, {});

  return (
    <section className={styles.sidebarList} aria-label="Lista de compromissos">
      {Object.keys(grouped).length === 0 ? (
        <p className={styles.sidebarEmpty}>Nenhum compromisso agendado.</p>
      ) : (
        Object.entries(grouped).map(([date, items]) => {
          const parsed = fromDateKey(date);
          const isToday = date === getToday();
          return (
            <div className={styles.appointmentGroup} key={date}>
              <h2 className={isToday ? styles.todayHeading : ''}>
                {isToday ? 'HOJE' : WEEK_DAYS_LONG[parsed.getDay()]}{' '}
                <span>{formatDate(date)}</span>
              </h2>
              {items.map((appointment) => (
                <div
                  className={styles.sidebarAppointment}
                  key={appointment.id}
                  role="button"
                  tabIndex={0}
                  onDoubleClick={() => onDoubleClick(appointment)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onDoubleClick(appointment);
                    }
                  }}
                  title="Dê dois cliques para ver os detalhes"
                >
                  <i
                    style={{ backgroundColor: appointment.colorConfig.value }}
                  />
                  <div>
                    <time>
                      {displayTime(appointment.time)} -{' '}
                      {displayTime(appointment.endTime)}
                    </time>
                    <p>{appointment.description || 'Compromisso'}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </section>
  );
}

function CalendarEvent({
  appointment,
  index,
  onContextMenu,
  onDoubleClick,
  hourHeight,
  compact = false,
}) {
  const color = getColor(appointment, index);
  const start = timeToMinutes(appointment.time);
  const end = timeToMinutes(appointment.endTime);
  const top = (start / 60) * hourHeight;
  const height = Math.max(((end - start) / 60) * hourHeight - 3, 38);

  return (
    <button
      type="button"
      className={`${styles.calendarEvent} ${compact ? styles.compactEvent : ''}`}
      style={{
        '--event-color': color.value,
        '--event-background': color.soft,
        '--event-text': color.text,
        top: `${top}px`,
        height: `${height}px`,
      }}
      onContextMenu={(event) => onContextMenu(event, appointment)}
      onDoubleClick={() => onDoubleClick(appointment)}
      title="Dê dois cliques para ver os detalhes. Clique com o botão direito para editar ou remover."
    >
      <time>
        {displayTime(appointment.time)} - {displayTime(appointment.endTime)}
      </time>
      <span>{appointment.description || 'Compromisso'}</span>
    </button>
  );
}

function TimeGrid({
  days,
  appointments,
  onContextMenu,
  onDoubleClick,
  scrollRef,
  hourHeight,
}) {
  const totalHeight = END_HOUR * hourHeight;
  const hours = Array.from({ length: END_HOUR + 1 }, (_, index) => index);
  const today = getToday();

  return (
    <div className={styles.timeGridScroll} ref={scrollRef}>
      <div
        className={styles.timeGridHeader}
        style={{ '--day-count': days.length }}
      >
        <div className={styles.headerGutter} />
        {days.map((day) => {
          const key = toDateKey(day);
          return (
            <div
              className={`${styles.dayHeader} ${key === today ? styles.currentDayHeader : ''}`}
              key={key}
            >
              <span>{WEEK_DAYS[day.getDay()]}</span>
              <strong>{day.getDate()}</strong>
            </div>
          );
        })}
        <div className={styles.headerGutter} />
      </div>
      <div
        className={styles.timeline}
        style={{
          height: totalHeight,
          '--day-count': days.length,
          '--hour-height': `${hourHeight}px`,
        }}
      >
        <div className={styles.timeLabels}>
          {hours.map((hour) => (
            <span key={hour} style={{ top: `${hour * hourHeight + 8}px` }}>
              {hour === 24 ? '00:00' : `${pad(hour)}:00`}
            </span>
          ))}
        </div>
        <div className={styles.dayColumns}>
          {days.map((day) => {
            const key = toDateKey(day);
            const dayAppointments = appointments.filter(
              (appointment) => appointment.date === key,
            );
            return (
              <div
                className={`${styles.dayColumn} ${key === today ? styles.currentDayColumn : ''}`}
                key={key}
              >
                {dayAppointments.map((appointment, index) => (
                  <CalendarEvent
                    appointment={appointment}
                    index={index}
                    key={appointment.id}
                    onContextMenu={onContextMenu}
                    onDoubleClick={onDoubleClick}
                    hourHeight={hourHeight}
                    compact={days.length > 1}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div className={`${styles.timeLabels} ${styles.rightTimeLabels}`}>
          {hours.map((hour) => (
            <span key={hour} style={{ top: `${hour * hourHeight + 8}px` }}>
              {hour === 24 ? '00:00' : `${pad(hour)}:00`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthView({
  selectedDate,
  appointments,
  onSelectDate,
  onContextMenu,
  onDoubleClick,
}) {
  const first = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
    12,
  );
  const start = addDays(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, index) => addDays(start, index));
  return (
    <div className={styles.monthView}>
      <div className={styles.monthWeekHeader}>
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.monthGrid}>
        {days.map((day) => {
          const key = toDateKey(day);
          const events = appointments.filter(
            (appointment) => appointment.date === key,
          );
          return (
            <div
              key={key}
              className={`${styles.monthCell} ${
                day.getMonth() !== selectedDate.getMonth()
                  ? styles.monthCellOutside
                  : ''
              } ${key === getToday() ? styles.monthCellToday : ''}`}
            >
              <button type="button" onClick={() => onSelectDate(day)}>
                {day.getDate()}
              </button>
              {events.slice(0, 3).map((appointment, index) => {
                const color = getColor(appointment, index);
                return (
                  <button
                    type="button"
                    key={appointment.id}
                    className={styles.monthEvent}
                    style={{
                      backgroundColor: color.soft,
                      borderLeftColor: color.value,
                      color: color.text,
                    }}
                    onContextMenu={(event) => onContextMenu(event, appointment)}
                    onDoubleClick={() => onDoubleClick(appointment)}
                    title="Dê dois cliques para ver os detalhes"
                  >
                    {displayTime(appointment.time)}{' '}
                    {appointment.description || 'Compromisso'}
                  </button>
                );
              })}
              {events.length > 3 && (
                <small>+{events.length - 3} compromissos</small>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearView({ selectedDate, appointments, onSelectDate }) {
  return (
    <div className={styles.yearView}>
      {MONTHS.map((month, monthIndex) => {
        const first = new Date(selectedDate.getFullYear(), monthIndex, 1, 12);
        const start = addDays(first, -first.getDay());
        const days = Array.from({ length: 42 }, (_, index) =>
          addDays(start, index),
        );
        return (
          <section className={styles.yearMonth} key={month}>
            <h2>{month}</h2>
            <div className={styles.yearWeekDays}>
              {WEEK_DAYS.map((day) => (
                <span key={day}>{day[0]}</span>
              ))}
            </div>
            <div className={styles.yearDays}>
              {days.map((day) => {
                const key = toDateKey(day);
                const hasEvents = appointments.some(
                  (appointment) => appointment.date === key,
                );
                return (
                  <button
                    type="button"
                    key={key}
                    className={`${day.getMonth() !== monthIndex ? styles.outsideYearMonth : ''} ${
                      key === getToday() ? styles.yearToday : ''
                    } ${hasEvents ? styles.hasEvents : ''}`}
                    onClick={() => onSelectDate(day)}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function AppointmentModal({
  appointment,
  customers,
  onClose,
  onSave,
  saving,
  error,
}) {
  const [form, setForm] = useState(appointment);
  const handleChange = ({ target }) =>
    setForm((current) => ({ ...current, [target.name]: target.value }));
  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="appointment-modal-title">
            {appointment.id ? 'Editar compromisso' : 'Novo compromisso'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
        >
          <label>
            Compromisso
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength="80"
              placeholder="Descreva brevemente o compromisso"
              required
              autoFocus
            />
          </label>
          <label>
            Cliente
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
            >
              <option value="">Nenhum cliente vinculado</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.modalRow}>
            <label>
              Data
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Início
              <input
                type="time"
                step="1800"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Término
              <input
                type="time"
                step="1800"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <fieldset>
            <legend>Cor do compromisso</legend>
            <div className={styles.colorPalette}>
              {COLORS.map((color) => (
                <label key={color.value} title={color.value}>
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={form.color === color.value}
                    onChange={handleChange}
                  />
                  <span style={{ backgroundColor: color.value }} />
                </label>
              ))}
            </div>
          </fieldset>
          {error && <p className={styles.modalError}>{error}</p>}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DeleteModal({ appointment, onCancel, onConfirm, deleting }) {
  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        className={`${styles.modal} ${styles.deleteModal}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>Remover compromisso?</h2>
        <p>
          O compromisso “{appointment.description || 'Compromisso'}” será
          excluído da sua agenda.
        </p>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </section>
    </div>
  );
}

function AppointmentDetailsModal({ appointment, customer, onClose }) {
  const color = getColor(appointment);

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className={`${styles.modal} ${styles.detailsModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-details-title"
        onMouseDown={(event) => event.stopPropagation()}
        onDoubleClick={onClose}
      >
        <span
          className={styles.detailsAccent}
          style={{ backgroundColor: color.value }}
        />
        <h2 id="appointment-details-title">
          {appointment.description || 'Compromisso'}
        </h2>
        <dl className={styles.detailsList}>
          <div>
            <dt>Data</dt>
            <dd>{formatDate(appointment.date)}</dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>
              {displayTime(appointment.time)} -{' '}
              {displayTime(appointment.endTime)}
            </dd>
          </div>
          <div>
            <dt>Cliente</dt>
            <dd>{customer?.name || 'Nenhum cliente vinculado'}</dd>
          </div>
        </dl>
        <p className={styles.detailsHint}>
          Dê dois cliques neste painel ou clique fora para fechar.
        </p>
      </section>
    </div>
  );
}

function Appointments() {
  const todayDate = useMemo(() => fromDateKey(getToday()), []);
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [miniMonth, setMiniMonth] = useState(todayDate);
  const [view, setView] = useState('week');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [modalAppointment, setModalAppointment] = useState(null);
  const [detailsAppointment, setDetailsAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const timeGridRef = useRef(null);
  const [hourHeight, setHourHeight] = useState(getHourHeight);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersResponse, appointmentsResponse] = await Promise.all([
          api.get('/customers'),
          api.get('/appointments'),
        ]);
        setCustomers(customersResponse.data);
        setAppointments(
          sortAppointments(appointmentsResponse.data.map(normalizeAppointment)),
        );
      } catch (error) {
        console.error('Erro ao carregar agenda:', error);
        setPageError(
          'Não foi possível carregar a agenda. Verifique se o servidor está ativo.',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      timeGridRef.current &&
      (view === 'week' || view === 'day')
    ) {
      timeGridRef.current.scrollTop = INITIAL_HOUR * hourHeight;
    }
  }, [hourHeight, loading, view]);

  useEffect(() => {
    const updateHourHeight = () => setHourHeight(getHourHeight());
    window.addEventListener('resize', updateHourHeight);
    return () => window.removeEventListener('resize', updateHourHeight);
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        setContextMenu(null);
        setModalAppointment(null);
        setAppointmentToDelete(null);
        setDetailsAppointment(null);
      }
    };
    window.addEventListener('click', closeMenu);
    window.addEventListener('keydown', closeWithEscape);
    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('keydown', closeWithEscape);
    };
  }, []);

  const customerById = useMemo(
    () =>
      Object.fromEntries(
        customers.map((customer) => [String(customer.id), customer]),
      ),
    [customers],
  );
  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    if (!term) return appointments;
    return appointments.filter((appointment) => {
      const customer = customerById[String(appointment.customerId)]?.name || '';
      return `${appointment.description} ${customer}`
        .toLocaleLowerCase('pt-BR')
        .includes(term);
    });
  }, [appointments, customerById, search]);
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );
  const visibleDays = view === 'day' ? [selectedDate] : weekDays;

  const goToDate = (date, switchToDay = false) => {
    setSelectedDate(date);
    setMiniMonth(new Date(date.getFullYear(), date.getMonth(), 1, 12));
    if (switchToDay) setView('day');
  };
  const navigateCalendar = (direction) => {
    let next;
    if (view === 'day') next = addDays(selectedDate, direction);
    else if (view === 'week') next = addDays(selectedDate, direction * 7);
    else if (view === 'month') next = addMonths(selectedDate, direction);
    else
      next = new Date(
        selectedDate.getFullYear() + direction,
        selectedDate.getMonth(),
        1,
        12,
      );
    goToDate(next);
  };
  const openCreateModal = () => {
    setModalError('');
    setModalAppointment({
      customerId: '',
      date: toDateKey(selectedDate),
      time: '08:00',
      endTime: '09:00',
      description: '',
      color: COLORS[0].value,
      status: 'scheduled',
    });
  };
  const openEditModal = (appointment) => {
    setModalError('');
    setModalAppointment({
      ...appointment,
      customerId: appointment.customerId ? String(appointment.customerId) : '',
    });
    setContextMenu(null);
  };
  const saveAppointment = async (form) => {
    setModalError('');
    if (timeToMinutes(form.endTime) <= timeToMinutes(form.time)) {
      setModalError('O horário de término deve ser posterior ao início.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        customerId: form.customerId || null,
        date: form.date,
        time: form.time,
        endTime: form.endTime,
        description: form.description.trim(),
        color: form.color,
        status: form.status || 'scheduled',
      };
      const response = form.id
        ? await api.put(`/appointments/${form.id}`, payload)
        : await api.post('/appointments', payload);
      const saved = normalizeAppointment(response.data, appointments.length);
      setAppointments((current) =>
        sortAppointments(
          form.id
            ? current.map((item) =>
                String(item.id) === String(form.id) ? saved : item,
              )
            : [...current, saved],
        ),
      );
      goToDate(fromDateKey(saved.date));
      setModalAppointment(null);
    } catch (error) {
      console.error('Erro ao salvar compromisso:', error);
      setModalError('Não foi possível salvar o compromisso. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  const deleteAppointment = async () => {
    try {
      setDeleting(true);
      await api.delete(`/appointments/${appointmentToDelete.id}`);
      setAppointments((current) =>
        current.filter(
          (item) => String(item.id) !== String(appointmentToDelete.id),
        ),
      );
      setAppointmentToDelete(null);
    } catch (error) {
      console.error('Erro ao remover compromisso:', error);
      setPageError('Não foi possível remover o compromisso.');
    } finally {
      setDeleting(false);
    }
  };
  const handleContextMenu = (event, appointment) => {
    event.preventDefault();
    setContextMenu({
      appointment,
      x: Math.min(event.clientX, window.innerWidth - 180),
      y: Math.min(event.clientY, window.innerHeight - 104),
    });
  };
  const openDetailsModal = (appointment) => {
    setContextMenu(null);
    setDetailsAppointment(appointment);
  };

  return (
    <main className={styles.page}>
      <AgendaNavbar />
      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <MiniCalendar
            displayedMonth={miniMonth}
            selectedDate={toDateKey(selectedDate)}
            onMonthChange={(amount) =>
              setMiniMonth(addMonths(miniMonth, amount))
            }
            onSelectDate={goToDate}
          />
          <AppointmentList
            appointments={appointments}
            onDoubleClick={openDetailsModal}
          />
        </aside>
        <section className={styles.calendarArea}>
          <div className={styles.toolbar}>
            <div className={styles.dateNavigation}>
              <IconButton
                icon={arrowLeft}
                label="Período anterior"
                onClick={() => navigateCalendar(-1)}
              />
              <button
                type="button"
                onClick={() => goToDate(fromDateKey(getToday()))}
              >
                Hoje
              </button>
              <IconButton
                icon={arrowRight}
                label="Próximo período"
                onClick={() => navigateCalendar(1)}
              />
            </div>
            <div
              className={styles.viewNavigation}
              aria-label="Visualização do calendário"
            >
              {VIEWS.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={view === option.id ? styles.activeView : ''}
                  onClick={() => setView(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className={styles.searchBox}>
              <img src={searchIcon} alt="" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar"
                aria-label="Pesquisar compromissos"
              />
            </label>
          </div>
          {pageError && <p className={styles.pageError}>{pageError}</p>}
          {loading ? (
            <div className={styles.loading}>Carregando agenda...</div>
          ) : (
            <div className={styles.calendarContent}>
              {(view === 'week' || view === 'day') && (
                <TimeGrid
                  days={visibleDays}
                  appointments={filteredAppointments}
                  onContextMenu={handleContextMenu}
                  onDoubleClick={openDetailsModal}
                  scrollRef={timeGridRef}
                  hourHeight={hourHeight}
                />
              )}
              {view === 'month' && (
                <MonthView
                  selectedDate={selectedDate}
                  appointments={filteredAppointments}
                  onSelectDate={(date) => goToDate(date, true)}
                  onContextMenu={handleContextMenu}
                  onDoubleClick={openDetailsModal}
                />
              )}
              {view === 'year' && (
                <YearView
                  selectedDate={selectedDate}
                  appointments={filteredAppointments}
                  onSelectDate={(date) => goToDate(date, true)}
                />
              )}
            </div>
          )}
          <button
            type="button"
            className={styles.floatingButton}
            onClick={openCreateModal}
            aria-label="Criar novo compromisso"
            title="Novo compromisso"
          >
            <img src={pencilIcon} alt="" />
          </button>
        </section>
      </div>
      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => openEditModal(contextMenu.appointment)}
          >
            Editar
          </button>
          <button
            type="button"
            className={styles.contextDelete}
            onClick={() => {
              setAppointmentToDelete(contextMenu.appointment);
              setContextMenu(null);
            }}
          >
            Remover
          </button>
        </div>
      )}
      {modalAppointment && (
        <AppointmentModal
          key={modalAppointment.id || 'new'}
          appointment={modalAppointment}
          customers={customers}
          onClose={() => setModalAppointment(null)}
          onSave={saveAppointment}
          saving={saving}
          error={modalError}
        />
      )}
      {appointmentToDelete && (
        <DeleteModal
          appointment={appointmentToDelete}
          onCancel={() => setAppointmentToDelete(null)}
          onConfirm={deleteAppointment}
          deleting={deleting}
        />
      )}
      {detailsAppointment && (
        <AppointmentDetailsModal
          appointment={detailsAppointment}
          customer={customerById[String(detailsAppointment.customerId)]}
          onClose={() => setDetailsAppointment(null)}
        />
      )}
    </main>
  );
}

const appointmentShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string,
});

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

MiniCalendar.propTypes = {
  displayedMonth: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.string.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onSelectDate: PropTypes.func.isRequired,
};

AppointmentList.propTypes = {
  appointments: PropTypes.arrayOf(appointmentShape).isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

CalendarEvent.propTypes = {
  appointment: appointmentShape.isRequired,
  index: PropTypes.number.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  hourHeight: PropTypes.number.isRequired,
  compact: PropTypes.bool,
};

TimeGrid.propTypes = {
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  appointments: PropTypes.arrayOf(appointmentShape).isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  scrollRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  hourHeight: PropTypes.number.isRequired,
};

MonthView.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  appointments: PropTypes.arrayOf(appointmentShape).isRequired,
  onSelectDate: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

YearView.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  appointments: PropTypes.arrayOf(appointmentShape).isRequired,
  onSelectDate: PropTypes.func.isRequired,
};

AppointmentModal.propTypes = {
  appointment: appointmentShape.isRequired,
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

DeleteModal.propTypes = {
  appointment: appointmentShape.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  deleting: PropTypes.bool.isRequired,
};

AppointmentDetailsModal.propTypes = {
  appointment: appointmentShape.isRequired,
  customer: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Appointments;
