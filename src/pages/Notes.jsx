import styles from './Notes.module.css';
import NoteCard from '../components/notes_page/NoteCard';
import Container from '../components/layout/Container';
import BigButton from '../components/global/BigButton';
import ConfirmDialog from '../components/global/ConfirmDialog';
import SubmitButton from '../components/form/SubmitButton';
import Button from '../components/global/Button';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function Notes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [notes, setNotes] = useState([]);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const customerResponse = await api.get(`/customers/${id}`);
      const notesResponse = await api.get(`/notes?customerId=${id}`);
      const orderedNotes = [...notesResponse.data].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      setCustomer(customerResponse.data);
      setNotes(orderedNotes);
    } catch (err) {
      console.error('Erro ao carregar os dados:', err);
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const confirmDelete = async () => {
    if (!noteToDelete) {
      return;
    }

    try {
      await api.delete(`/notes/${noteToDelete.id}`);
      setNotes((currentNotes) =>
        currentNotes.filter(
          (note) => String(note.id) !== String(noteToDelete.id),
        ),
      );
    } catch (err) {
      console.error('Erro ao excluir anotação:', err);
      setError('Erro ao excluir anotação. Tente novamente.');
    } finally {
      setNoteToDelete(null);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  if (error) {
    return (
      <div>
        <p className={styles.error}>{error}</p>
        <SubmitButton text="TENTAR NOVAMENTE" onClick={fetchCustomerData} />
      </div>
    );
  }

  if (!customer) {
    return (
      <p className={styles.error}>Informações do cliente não disponíveis.</p>
    );
  }

  return (
    <Container>
      <div className={styles.header}>
        <h1 className={styles.customerName}>{customer.name}</h1>
        <div className={styles.customerActions}>
          <Link to={`/customers/${id}/info`}>
            <SubmitButton text="INFORMAÇÕES DO CLIENTE" />
          </Link>
          <Link to={`/customers/edit/${id}`}>
            <Button type="EditButton" title="Editar cliente" />
          </Link>
        </div>
        <div className={styles.title}>Histórico</div>
      </div>
      <div className={styles.notesList}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              content={note.note || ''}
              date={note.date || 'Data não disponível'}
              expanded={String(expandedNoteId) === String(note.id)}
              onExpand={() =>
                setExpandedNoteId((currentId) =>
                  String(currentId) === String(note.id) ? null : note.id,
                )
              }
              onEdit={() => navigate(`/notes/${id}/edit/${note.id}`)}
              onDelete={() => setNoteToDelete(note)}
            />
          ))
        ) : (
          <p className={styles.noNotes}>Nenhuma anotação encontrada.</p>
        )}
      </div>
      <div className={styles.pageActions}>
        <Link to={`/notes/${id}/new`}>
          <BigButton icon="newNote" name="NOVA ANOTAÇÃO" />
        </Link>
        <Link to="/customers">
          <SubmitButton text="VOLTAR" customClass="logoffBtn" />
        </Link>
      </div>
      {noteToDelete && (
        <ConfirmDialog
          message={`Deseja excluir a anotação "${noteToDelete.title}"?`}
          onCancel={() => setNoteToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </Container>
  );
}

export default Notes;
