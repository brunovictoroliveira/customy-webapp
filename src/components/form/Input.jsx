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
  const fieldProps = {
    name,
    id: name,
    placeholder,
    value,
    onChange: handleOnChange,
    ...rest,
  };

  return (
    <div className={`${styles.form_control} ${customClass}`}>
      <label htmlFor={name}>{text}</label>
      {type === 'textarea' ? (
        <textarea {...fieldProps} />
      ) : (
        <input type={type} {...fieldProps} />
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
