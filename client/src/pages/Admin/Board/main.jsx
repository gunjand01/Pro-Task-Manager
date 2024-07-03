import { useState, useContext } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Users } from "lucide-react";
import Title from "../../../components/Title";
import { AuthContext } from "../../context/AuthProvider";
import { TasksContext } from "../../context/TaskProvider";
import getFormattedDate from "../../../store/getFormattedDate";
import TaskContainer from "./TaskContainer";
import useModal from "../../../hooks/useModal";
import styles from "./main.module.css";

const options = [
  { id: 1, name: "Today", value: 1 },
  { id: 2, name: "This week", value: 7 },
  { id: 3, name: "This month", value: 30 },
];

export default function Board() {
  const { user } = useContext(AuthContext);
  const { selectedDateRange, setSelectedDateRange } = useContext(TasksContext);
  const { isOpen: assignIsOpen, toggleModal: toggleAssignModal } = useModal();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const dateString = getFormattedDate(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState();

  const handleAddPeople = async (e) => {
    e.preventDefault();

    if (!mail) {
      setError("Email is required!");
      return;
    }

    if (mail === currentUser?.email) {
      setError("Yours and assignee email cannot be same!");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/assignee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email: mail }),
      });
      setUpdatedUser(res?.data);
      toggleAssignModal();
      setConfirmationModalOpen(true);
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false);
    setMail("");
    setError("");
    setCurrentUser(updatedUser);
  };

  return (
    <div className={styles.container}>
      <div className={styles.groupOne}>
        <p className={styles.welcomeUser}>Welcome! {user.info.name}</p>
        <p className={styles.date}>{dateString}</p>
      </div>

      <div className={styles.groupTwo}>
        <p className={styles.board}>
          Board
          <button className={styles.addPeople} onClick={toggleAssignModal}>
            <Users className={styles.addPeopleIcon} /> Add People
          </button>
        </p>

        {assignIsOpen && (
          <Title toggleModal={toggleAssignModal}>
            <p className={styles.addPeopleTitle}>Add people to the board</p>
            <form onSubmit={handleAddPeople}>
              <div className={styles.input}>
                <input
                  placeholder="Enter the email"
                  type="email"
                  id="AssignEmail"
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div>
                <button className={styles.cancel} onClick={toggleAssignModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.button}>
                  Add Email
                </button>
              </div>
            </form>
          </Title>
        )}

        {isConfirmationModalOpen && (
          <Title toggleModal={handleConfirmationClose}>
            <div className={styles.confirmationModal}>
              <p className={styles.addPeopleTitle}>{mail} added to board</p>
              <button
                className={styles.button}
                onClick={handleConfirmationClose}
              >
                Okay, got it!
              </button>
            </div>
          </Title>
        )}

        <Listbox
          as="div"
          className={styles.listbox}
          value={selectedDateRange}
          onChange={setSelectedDateRange}
        >
          {({ open }) => (
            <>
              <Listbox.Button className={styles.listboxButton}>
                {selectedDateRange.name}
                <ChevronDown size={16} className={open ? styles.rotate : ""} />
              </Listbox.Button>

              <Listbox.Options className={styles.listboxOptions}>
                {options.map((option) => (
                  <Listbox.Option key={option.id} value={option}>
                    {({ active, selected }) => (
                      <div
                        className={`${active && styles.active} ${
                          styles.listboxOption
                        } ${selected && styles.selected}`}
                      >
                        {option.name}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </>
          )}
        </Listbox>
      </div>

      <TaskContainer />
    </div>
  );
}
