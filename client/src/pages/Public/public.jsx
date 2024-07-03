import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/codesandbox.png';
import useFetch from '../../hooks/useFetch';
import PublicCard from './Card';
import styles from './public.module.css';

export default function PublicLayout() {
  const { taskId } = useParams();
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/tasks/${taskId}`;
  const { data, isLoading, error } = useFetch(url);

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (error) {
    content = <p>{error.message}</p>;
  }

  if (data) {
    content = <PublicCard task={data.task} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <div className={styles.image}>
          <img src={logo} alt="Pro manage" />
        </div>

        <div className={styles.title}>
          <Link to='/'>Pro Manage</Link>
        </div>
      </div>

      <main>{content}</main>
    </div>
  );
}