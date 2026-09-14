import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = ({
  type,
  text,
  name,
  placeholder = '',
  value,
  handleOnChange,
  customClass = '',
  ...rest
}) => {
  const { className = '', ...inputProps } = rest;
  const controlClassName = `${styles.control} ${className}`.trim();

  const fieldProps = {
    name,
    id: name,
    placeholder,
    value,
    onChange: handleOnChange,
    ...inputProps,
  };

  return (
    <div className={`${styles.fieldGroup} ${customClass}`.trim()}>
      <label className={styles.label} htmlFor={name}>
        {text}
      </label>
      {type === 'textarea' ? (
        <textarea
          className={`${controlClassName} ${styles.textarea}`}
          {...fieldProps}
        />
      ) : (
        <input className={controlClassName} type={type} {...fieldProps} />
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleOnChange: PropTypes.func,
  customClass: PropTypes.string,
};

export default Input;
