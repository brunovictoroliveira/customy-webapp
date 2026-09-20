import styles from './BigButton.module.css';
import { PropTypes } from 'prop-types';

function BigButton({ icon, name, customClass = '', iconClass = '' }) {
  return (
    <div className={styles.button}>
      <div className={`${styles[icon]} ${iconClass}`.trim()}></div>
      <span className={customClass}>{name}</span>
    </div>
  );
}

BigButton.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  iconClass: PropTypes.string,
};

export default BigButton;
