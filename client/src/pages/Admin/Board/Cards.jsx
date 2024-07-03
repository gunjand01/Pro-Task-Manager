import { useContext, useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import Badge from "../../../components/Badge";
import useModal from "../../../hooks/useModal";
import { TasksContext } from "../../context/TaskProvider";
import { AuthContext } from "../../context/AuthProvider";
import CheckLists from "./CheckLists";
import TaskModal from "./TaskModal";
import styles from "./Cards.module.css";
import copyLink from "../../../store/copyLink";

const categories = [
  { id: 1, title: "Backlog", value: "backlog" },
  { id: 2, title: "To do", value: "todo" },
  { id: 3, title: "In progress", value: "inProgress" },
  { id: 4, title: "Done", value: "done" },
];

export default function Cards({ task, isOpen, toggleDisclosure }) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const { minorTaskUpdate, deleteTask } = useContext(TasksContext);
  const { isOpen: editIsOpen, toggleModal: toggleEditModal } = useModal();
  const { isOpen: deleteIsOpen, toggleModal: toggleDeleteModal } = useModal();
  const [assignedEmail, setAssignedEmail] = useState([]);


  const handleTaskDelete = (taskId) => {
    setIsLoading(true);
    try {
      deleteTask(taskId);
      toggleDeleteModal();
      toast.success("Deleted task successfully");
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const handleMinorUpdates = (updates) => {
    try {
      minorTaskUpdate(task, updates);
    } catch (err) {
      toast.error(err.message);
    } 
  };

  useEffect(() => {
    const fetchAssignedEmails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setAssignedEmail(data.data.info.myAssignies);
        console.log(data.data.info.myAssignies);

      } catch (error) {
        console.error("Error fetching assigned emails:", error);
      }
    };

    fetchAssignedEmails();
  }, [user.token]);

  const getInitials = (email) => email.substring(0, 2).toUpperCase();

  const initials = assignedEmail.slice(0, 2).map((email) => getInitials(email)).join("");

  return (
    <>
      <div className={styles.container}>
        <div className={styles.groupOne}>
        {initials && (
            <div className={styles.assignedEmailCircle}>
              {initials}
            </div>
          )}
          <p className={styles.priorityName}>
            <span className={styles[task.priority]}>•</span>{" "}
            {task.priority.toUpperCase()} PRIORITY
          </p>

          <div className={styles.menu}>
            <Menu>
              <Menu.Button className={styles.menuButton}>
                <MoreHorizontal />
              </Menu.Button>

              <div className={styles.menuItems}>
                <Menu.Items>
                  <Menu.Item className={styles.menuItem}>
                    {({ active }) => (
                      <div
                        className={active && styles.active}
                        onClick={toggleEditModal}
                      >
                        Edit
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => copyLink(task._id)}
                    className={styles.menuItem}
                  >
                    {({ active }) => (
                      <div className={active && styles.active}>Share</div>
                    )}
                  </Menu.Item>

                  <Menu.Item
                    onClick={toggleDeleteModal}
                    className={styles.menuItem}
                  >
                    {({ active }) => (
                      <div
                        style={{ color: "red" }}
                        className={`${styles.error} ${active && styles.active}`}
                      >
                        Delete
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </div>
            </Menu>
          </div>
        </div>

        <p className={styles.taskTitle}>{task.title}</p>

        <CheckLists
          isOpen={isOpen}
          toggleDisclosure={toggleDisclosure}
          task={task}
          checklists={task.checklists}
        />

        <div className={styles.badges}>
          {task.dueDate && (
            <Badge
              variant={
                task.status == "done"
                  ? "success"
                  : task.isExpired
                  ? "error"
                  : ""
              }
            >
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Badge>
          )}
          <div className={styles.categoryBadges}>
            {categories.map((category) => {
              if (category.value !== task.status) {
                return (
                  <div key={category.id} className="">
                    <Badge
                      onClick={() =>
                        handleMinorUpdates({ status: category.value })
                      }
                    >
                      {category.title}
                    </Badge>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {deleteIsOpen && (
        <Title toggleModal={toggleDeleteModal}>
          <p className={styles.deleteWarning}>Are you sure want to delete?</p>

          <div className={styles.deleteActions}>
            <Button onClick={() => handleTaskDelete(task._id)}>
              {isLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
            <Button variant="outline" color="error" onClick={toggleDeleteModal}>
              Cancel
            </Button>
          </div>
        </Title>
      )}

      {editIsOpen && (
        <Title toggleModal={toggleEditModal}>
          <TaskModal
            defaultTask={task}
            action="update"
            toggleModal={toggleEditModal}
          />
        </Title>
      )}
    </>
  );
}

Cards.propTypes = {
  task: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDisclosure: PropTypes.func.isRequired,
};
