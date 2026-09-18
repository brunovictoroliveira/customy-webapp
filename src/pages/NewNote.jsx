import { useState, useEffect } from 'react';
import styles from './forms.module.css';

import Input from '../components/form/Input';
import BigButton from '../components/global/BigButton';
import SubmitButton from '../components/form/SubmitButton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const getToday = () => new Date().toISOString().slice(0, 10);

const NewNote = () => {
  const { customerId, noteId } = useParams();
  const isEditing = Boolean(noteId);
  const [note, setNote] = useState({
    date: getToday(),
    title: '',
    note: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${noteId}`);
        setNote({
          date: response.data.date || getToday(),
          title: response.data.title || '',
          note: response.data.note || '',
        });
      } catch (err) {
        console.error('Erro ao buscar anotação:', err);
        setError('Não foi possível carregar a anotação.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [isEditing, noteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!note.title.trim()) {
      setError('O campo Título é obrigatório.');
      return;
    }

    if (!customerId) {
      setError('ID do cliente não identificado.');
      return;
    }

    const payload = {
      ...note,
      customerId: String(customerId),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await api.put(`/notes/${noteId}`, payload);
      } else {
        await api.post('/notes', {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }

      navigate(`/anotacoes/${customerId}`);
    } catch (err) {
      console.error('Erro ao salvar anotação:', err);
      setError('Erro ao salvar anotação. Tente novamente.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>
        {isEditing ? 'Editar anotação' : 'Nova anotação'}
      </h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.inputs}>
          <Input
            type="date"
            text="Data"
            name="date"
            value={note.date}
            handleOnChange={handleChange}
          />
          <Input
            type="text"
            text="Título"
            name="title"
            placeholder="Digite o título da anotação"
            value={note.title}
            handleOnChange={handleChange}
          />
          <Input
            type="textarea"
            text="Anotação"
            name="note"
            placeholder="Escreva sua anotação"
            value={note.note}
            handleOnChange={handleChange}
          />
        </div>
      )}
      <div className={styles.buttons}>
        <button type="submit" disabled={loading}>
          <BigButton icon="save" name="Salvar" />
        </button>
        <Link to={customerId ? `/anotacoes/${customerId}` : '/clientes'}>
          <SubmitButton text="Voltar" customClass="logoffBtn" />
        </Link>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default NewNote;
