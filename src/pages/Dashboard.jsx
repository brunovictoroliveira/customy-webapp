import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import BigButton from '../components/global/BigButton';
import SubmitButton from '../components/form/SubmitButton';
import { logout } from '../services/auth';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section className={styles.dashboard}>
      <h1 className={styles.title}>Customy</h1>
      <p className={styles.subtitle}>O que deseja gerenciar agora?</p>

      <div className={styles.actions}>
        <Link to="/clientes">
          <BigButton icon="newCostumer" name="CLIENTES" />
        </Link>
        <Link to="/agenda">
          <BigButton icon="calendar" name="AGENDA" />
        </Link>
        <SubmitButton
          text="DESLOGAR"
          customClass="logoffBtn"
          onClick={handleLogout}
        />
      </div>
    </section>
  );
}

export default Dashboard;
