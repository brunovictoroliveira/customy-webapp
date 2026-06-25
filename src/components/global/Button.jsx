import styles from './Button.module.css';
import { PropTypes } from 'prop-types';

function Button({ type, onClick, title }) {
  return (
    <button
      type="button"
      className={styles[type]}
      onClick={onClick}
      title={title}
      aria-label={title}
    />
  );
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default Button;
