import { useContext } from 'react';
import { Database, LogOut, PanelsTopLeft, Settings } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/codesandbox.png';
import Button from '../../components/Button';
import {AuthContext}  from '../context/AuthProvider';
import styles from './Sidebar.module.css';
import useModal from '../../hooks/useModal';
import Title from '../../components/Title';

export default function Navigation() {
  const { logout } = useContext(AuthContext);
  const { isOpen, toggleModal } = useModal();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.image}>
            <img src={logo} alt="Pro manage" />
          </div>
          <Link to="/">
            <p className={styles.heading}>
              Pro Manage
            </p>
          </Link>
        </div>

        <nav className={styles.links}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <div className={styles.icon}>
              <PanelsTopLeft color="#767575" />
            </div>
            <p className={styles.title}>Board</p>
          </NavLink>

          <NavLink
            to={'analytics'}
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <div className={styles.icon}>
              <Database color="#767575" />
            </div>
            <p className={styles.title}>Analytics</p>
          </NavLink>

          <NavLink
            to={'settings'}
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <div className={styles.icon}>
              <Settings color="#767575" />
            </div>
            <p className={styles.title}>Settings</p>
          </NavLink>
        </nav>

        <div onClick={toggleModal} className={styles.logout}>
          <div className={styles.icon}>
            <LogOut />
          </div>
          <p className={styles.logoutText}>Logout</p>
        </div>
      </div>

      {isOpen && (
        <Title toggleModal={toggleModal}>
          <p className={styles.warning}>
            Are you sure want to logout?
          </p>

          <div className={styles.logoutActions}>
            <Button onClick={logout}>Yes, Logout</Button>
            <Button variant="outline" color="error" onClick={toggleModal}>
              Cancel
            </Button>
          </div>
        </Title>
      )}
    </>
  );
}