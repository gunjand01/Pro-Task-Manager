import { useState } from 'react';
import { CopyMinus, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import Title from '../../../components/Title';
import useModal from '../../../hooks/useModal';
import Cards from './Cards';
import TaskModal from './TaskModal';
import styles from './Container.module.css';

export default function Container({ tasks, category }) {
  const { isOpen: isCreateOpen, toggleModal: toggleCreateModal } = useModal();
  const [openDisclosures, setOpenDisclosures] = useState([]);

  const closeDisclosure = (id) => {
    setOpenDisclosures(
      openDisclosures.filter((disclosure) => disclosure !== id)
    );
  };

  const openDisclosure = (id) => {
    const updatedDisclosures = [...openDisclosures, id];
    setOpenDisclosures(updatedDisclosures);
  };

  const toggleDisclosure = (id) => {
    if (openDisclosures.includes(id)) {
      closeDisclosure(id);
    } else {
      openDisclosure(id);
    }
  };

  const closeAllDisclosure = () => {
    setOpenDisclosures([]);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.categoryTitle}>
            {category.title}
          </p>
          <div className={styles.icons}>
            {category.title == 'To do' && (
              <Plus size={20} color="#767575" onClick={toggleCreateModal} />
            )}
            <CopyMinus
              size={20}
              color={openDisclosures.length ? '#17a2b8' : '#767575'}
              onClick={closeAllDisclosure}
            />
          </div>
        </div>

        <div className={styles.tasks}>
          {tasks.map((task) => {
            if (task.status == category.value) {
              return (
                <Cards
                  key={task._id}
                  task={task}
                  isOpen={openDisclosures?.includes(task._id)}
                  toggleDisclosure={() => toggleDisclosure(task._id)}
                />
              );
            }
          })}
        </div>
      </div>

      {isCreateOpen && (
        <Title toggleModal={toggleCreateModal}>
          <TaskModal toggleModal={toggleCreateModal} />
        </Title>
      )}
    </>
  );
}

Container.propTypes = {
  tasks: PropTypes.array,
  category: PropTypes.object,
};