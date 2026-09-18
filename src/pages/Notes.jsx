import styles from './Notes.module.css';
import NoteCard from '../components/notes_page/NoteCard';
import AgendaNavbar from '../components/layout/AgendaNavbar';
import BigButton from '../components/global/BigButton';
import ConfirmDialog from '../components/global/ConfirmDialog';
import SubmitButton from '../components/form/SubmitButton';
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

  return (
    <div className={styles.page}>
      <AgendaNavbar />
      <main className={styles.main}>
        <div className={styles.centralize}>
          {loading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : error ? (
            <div className={styles.errorState}>
              <p className={styles.error}>{error}</p>
              <SubmitButton
                text="Tentar novamente"
                onClick={fetchCustomerData}
              />
            </div>
          ) : !customer ? (
            <p className={styles.error}>
              Informações do cliente não disponíveis.
            </p>
          ) : (
            <>
              <div className={styles.header}>
                <h1 className={styles.customerName}>{customer.name}</h1>
                <div className={styles.customerActions}>
                  <Link to={`/clientes/${id}/informacoes`}>
                    <SubmitButton
                      text="Informações do cliente"
                      customClass="customerInfoBtn interBold"
                    />
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
                          String(currentId) === String(note.id)
                            ? null
                            : note.id,
                        )
                      }
                      onEdit={() =>
                        navigate(`/anotacoes/${id}/editar/${note.id}`)
                      }
                      onDelete={() => setNoteToDelete(note)}
                    />
                  ))
                ) : (
                  <p className={styles.noNotes}>Nenhuma anotação encontrada.</p>
                )}
              </div>

              <div className={styles.pageActions}>
                <Link to="/clientes">
                  <SubmitButton
                    text="Voltar"
                    customClass="logoffBtn interBold"
                  />
                </Link>
                <Link to={`/anotacoes/${id}/nova`}>
                  <BigButton
                    icon="newNote"
                    name="Nova anotação"
                    customClass="interBold"
                  />
                </Link>
              </div>
            </>
          )}

          {noteToDelete && (
            <ConfirmDialog
              message={`Deseja excluir a anotação "${noteToDelete.title}"?`}
              onCancel={() => setNoteToDelete(null)}
              onConfirm={confirmDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Notes;
