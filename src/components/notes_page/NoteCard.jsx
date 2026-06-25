import styles from './NoteCard.module.css';
import Button from '../global/Button';
import PropTypes from 'prop-types';

const formatDate = (date) => {
  if (!date) {
    return 'Data não disponível';
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('pt-BR');
};

function NoteCard({
  title,
  content,
  date,
  expanded,
  onExpand,
  onEdit,
  onDelete,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.date}>{formatDate(date)}</div>
        <div className={styles.buttons}>
          <Button
            type="ExpandButton"
            onClick={onExpand}
            title={expanded ? 'Recolher anotação' : 'Expandir anotação'}
          />
          <Button type="EditButton" onClick={onEdit} title="Editar anotação" />
          <Button
            type="DeleteButton"
            onClick={onDelete}
            title="Excluir anotação"
          />
        </div>
      </div>
      <div
        className={`${styles.title} ${!expanded ? styles.collapsedTitle : ''}`}
      >
        {title}
      </div>
      {expanded && <div className={styles.text}>{content}</div>}
    </div>
  );
}

NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  date: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteCard;
