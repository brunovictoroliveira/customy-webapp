import styles from './BigButton.module.css';
import { PropTypes } from 'prop-types';

function BigButton({ icon, name }) {
  return (
    <div className={styles.button}>
      <div className={styles[icon]}></div>
      <span>{name}</span>
    </div>
  );
}

BigButton.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default BigButton;
