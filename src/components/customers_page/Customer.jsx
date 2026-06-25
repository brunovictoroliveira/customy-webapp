import Button from '../global/Button';
import styles from './Customer.module.css';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

function Customer({ id, name, onDelete }) {
  return (
    <div className={styles.container_inline}>
      <div className={styles.bar}>
        <Link to={`/notes/${id}`} className={styles.name}>
          {name}
        </Link>
        <div className={styles.buttons}>
          <Link to={`/customers/edit/${id}`}>
            <Button type="EditButton" title="Editar cliente" />
          </Link>
          <Button
            type="DeleteButton"
            title="Excluir cliente"
            onClick={() => onDelete(id, name)}
          />
        </div>
      </div>
    </div>
  );
}

Customer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Customer;
