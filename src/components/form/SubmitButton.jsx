import styles from './SubmitButton.module.css';
import PropTypes from 'prop-types';

function SubmitButton({ text, customClass, onClick, type = 'button' }) {
  return (
    <button
      className={`${styles.btn} ${styles[customClass]}`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default SubmitButton;
