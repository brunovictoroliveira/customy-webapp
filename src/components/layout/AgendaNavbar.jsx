import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './AgendaNavbar.module.css';
import logo from '../../assets/logos/logo_customy_horizontal.svg';
import logoutIcon from '../../assets/icons/logout-box-line.svg';
import { getSession, logout } from '../../services/auth';

function AgendaNavbar() {
  const navigate = useNavigate();
  const session = getSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegação principal">
        <NavLink
          className={styles.logoLink}
          to="/agenda"
          aria-label="Ir para a agenda"
        >
          <img src={logo} alt="Customy" />
        </NavLink>
        <NavLink
          to="/agenda"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ''}`
          }
          onClick={() => setMenuOpen(false)}
        >
          Agenda
        </NavLink>
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ''}`
          }
          onClick={() => setMenuOpen(false)}
        >
          Clientes
        </NavLink>
      </nav>

      <div className={styles.account}>
        <span>
          Olá, <strong>{session?.name || 'Usuário'}</strong>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Deslogar"
          title="Deslogar"
        >
          <img src={logoutIcon} alt="" />
        </button>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        aria-controls="agenda-mobile-menu"
      >
        <span />
        <span />
        <span />
      </button>
      {menuOpen && (
        <div className={styles.mobileMenu} id="agenda-mobile-menu">
          <NavLink to="/agenda" onClick={() => setMenuOpen(false)}>
            Agenda
          </NavLink>
          <NavLink to="/clientes" onClick={() => setMenuOpen(false)}>
            Clientes
          </NavLink>
          <div className={styles.mobileLogout}>
            <span>Deslogar</span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Deslogar"
              title="Deslogar"
            >
              <img src={logoutIcon} alt="" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default AgendaNavbar;
