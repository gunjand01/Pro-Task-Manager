import { useContext, useMemo } from 'react';
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../context/AuthProvider';
import styles from './analytics.module.css';

const statusItems = [
  { name: 'Backlog Tasks', value: 'backlog' },
  { name: 'To-do Tasks', value: 'todo' },
  { name: 'In-Progress Tasks', value: 'inProgress' },
  { name: 'Completed Tasks', value: 'done' },
];

const priorityItems = [
  { name: 'Low Priority', value: 'low' },
  { name: 'Moderate Priority', value: 'moderate' },
  { name: 'High Priority', value: 'high' },
  { name: 'Due Date Tasks', value: 'due' },
];

export default function Analytics() {
  const { user } = useContext(AuthContext);
  const { token } = user;

  const url = useMemo(() => process.env.REACT_APP_BACKEND_URL + '/api/v1/tasks/analytics', []);
  const options = useMemo(() => ({ headers: { Authorization: 'Bearer ' + token } }), [token]);

  const { data, isLoading, error } = useFetch(url, options);

  return (
    <div className={styles.container}>
      <p className={styles.heading}>Analytics</p>

      {data && (
        <div className={styles.lists}>
          <DataList title="Status" items={statusItems} data={data.status} />
          <DataList title="Priorities" items={priorityItems} data={data.priorities} />
        </div>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  ); 
}

const DataList = ({ title, items, data }) => (
  <ul className={styles.listBox}>
    {items.map(({ name, value }) => (
      <li key={value}>
        <div>
          <p>{name}</p>
          <p weight="500">{data[value]}</p>
        </div>
      </li>
    ))}
  </ul>
);
