import PropTypes from 'prop-types';
import styles from './Form.module.css';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export default function Form({ title, children }) {
  return (
    <div className={styles.container}>
      <p className={styles.title} >
        {title}
      </p>


      {children}

      <div className={styles.navigation}>
        <p className={styles.subtitle}>
          {title === 'Register' ? 'Have an account ?' : 'Have no account yet?'}
        </p>
        <Link to={title == 'Register' ? '..' : 'register'}>
          <Button variant="outline" >
            {title == 'Register' ? 'Login' : 'Register'}
          </Button>
        </Link>
      </div>
    </div>
  );
}

Form.propTypes = {
  title: PropTypes.oneOf(['Login', 'Register']).isRequired,
  children: PropTypes.node,
};