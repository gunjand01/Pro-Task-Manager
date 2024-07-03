import PropTypes from 'prop-types';
import Badge from '../../components/Badge';
import styles from './Card.module.css';

export default function Card({ task }) {
  const dones = task.checklists.filter((list) => list.checked);

  return (
    <div className={styles.container}>
      <p className={styles.priority}>
        <span className={styles[task.priority]}>•</span>{' '}
        {task.priority.toUpperCase()} PRIORITY
      </p>

      <p className={styles.title}>
        {task.title}
      </p>

      <div className={styles.checklists}>
        <p className={styles.ChecklistsNumber}>
          Checklists ({dones.length + '/' + task.checklists.length})
        </p>
        <div className={styles.lists}>
          {task.checklists.map((list) => (
            <div key={list.id} className={styles.list}>
              <input type="checkbox" name="" id="" checked={list.checked} />
              <p className={styles.ListTitle}>{list.title}</p>
            </div>
          ))}
        </div>
      </div>

      {task.dueDate && (
        <div className={styles.dueDate}>
          <p className={styles.dueDateTitle}>Due Date</p>
          <Badge variant="error">
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Badge>
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  task: PropTypes.object,
};