import styles from './SubmitButton.module.css';
import PropTypes from 'prop-types';

function SubmitButton({
  text,
  customClass = '',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) {
  const variantClass = customClass
    .split(' ')
    .filter(Boolean)
    .map((className) => styles[className] || className)
    .join(' ');

  return (
    <button
      className={`${styles.btn} ${variantClass} ${className}`.trim()}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SubmitButton;
