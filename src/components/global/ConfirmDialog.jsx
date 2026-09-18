import PropTypes from 'prop-types';
import styles from './ConfirmDialog.module.css';
import SubmitButton from '../form/SubmitButton';

function ConfirmDialog({ message, onCancel, onConfirm }) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <p>{message}</p>
        <div className={styles.actions}>
          <SubmitButton
            text="Cancelar"
            customClass="logoffBtn"
            onClick={onCancel}
          />
          <SubmitButton text="Confirmar" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
