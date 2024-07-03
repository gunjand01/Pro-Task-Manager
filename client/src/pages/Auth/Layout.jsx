import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import astroBoy from '../../assets/Group.png';

// import { Text } from '../../components/ui';
import styles from './Layout.module.css';
// import { useContext, useEffect } from 'react';
// import { AuthContext } from '../../store/AuthProvider';

export default function AuthLayout() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/');
//     }
//   }, [user, navigate]);

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#fff',
            color: 'black',
          },
        }}
      />

      <main className={styles.container}>
        <div className={styles.poster}>
          <div className={styles.image}>
            <img src={astroBoy} alt="Astro boy" />
          </div>

          <p className={styles.heading1}>
            Welcome aboard my friend
          </p>

          <p className={styles.heading2}>
            Just a couple of clicks and we start
          </p>
        </div>

        <div className={styles.outlet}>
          <Outlet />
        </div>
      </main>
    </>
  );
}