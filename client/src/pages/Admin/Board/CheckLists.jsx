import { useContext } from "react";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { TasksContext } from "../../context/TaskProvider";
import styles from "./CheckLists.module.css";
import toast from "react-hot-toast";

export default function CheckLists({ task, isOpen, toggleDisclosure }) {
  const lists = task.checklists;
  const dones = lists.filter((list) => list.checked);
  const { minorTaskUpdate } = useContext(TasksContext);

  const SECONDARY_COLOR = "#767575";

  const handleList = async (listId, value) => {
    const index = lists.findIndex((l) => l._id === listId);

    if (index < 0) return;

    const copiedLists = JSON.parse(JSON.stringify(lists));
    copiedLists[index].checked = value;

    try {
      await minorTaskUpdate(task, { checklists: copiedLists });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.Bigcontainer}>
      <div className={styles.heading}>
        <p className={styles.checklist}>
          Checklist ({dones.length + "/" + lists.length})
        </p>

        <button className={styles.button} onClick={toggleDisclosure}>
          <ChevronDown
            className={isOpen && styles.rotate}
            color={SECONDARY_COLOR}
          />
        </button>
      </div>

      {isOpen && (
        <div className={styles.lists}>
          {lists.map((list) => {
            return (
              <div className={styles.container}>
                <input
                  type="checkbox"
                  name=""
                  id=""
                  checked={list.checked}
                  onChange={handleList}
                />
                <label className={styles.title}>{list.title}</label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

CheckLists.propTypes = {
  task: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  toggleDisclosure: PropTypes.func.isRequired,
};
