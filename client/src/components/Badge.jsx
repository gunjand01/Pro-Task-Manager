import styles from './Badge.module.css';
import PropTypes from 'prop-types';

export default function Badge({ children, variant = 'default', onClick }) {
  const badgeVariant = styles[variant];

  return (
    <div className={`${badgeVariant} ${styles.badge}`} onClick={onClick}>
      <p className={styles.badgeName}>{children}</p>
    </div>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  onClick: PropTypes.func,
};