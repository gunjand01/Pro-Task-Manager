import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import {
  Listbox,
  ListboxButton,
  Transition,
  ListboxOption,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import styles from "./UserList.module.css";

function UserList({ setUser }) {
  const { user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState();
  const [assignedEmail, setAssignedEmail] = useState([]);

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

  const handleChange = (value) => {
    setSelectedUser(value);
    setUser(value);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Assign to</p>
      <Listbox value={selectedUser} onChange={handleChange}>
        <div className={styles.container}>
          <ListboxButton className={styles.listbox}>
            <span className={styles.text}>
              {selectedUser || "Add an assignee"}
            </span>
            <span className={styles.icon}>
              <ChevronDown aria-hidden="true" />
            </span>
          </ListboxButton>

          <Transition
            as="div"
            enterFrom={styles.transitionEnterFrom}
            enterTo={styles.transitionEnterTo}
            leave={styles.transitionLeave}
            leaveFrom={styles.transitionLeaveFrom}
            leaveTo={styles.transitionLeaveTo}
          >
            <Listbox.Options className={styles.options}>
              {assignedEmail && assignedEmail.length > 0 ? (
                assignedEmail.map((email, index) => (
                  <ListboxOption key={index} value={email} className={styles.option}>
                    <div className={styles.optionContent}>
                      <div className={styles.circle}>
                        {email.substring(0, 2).toUpperCase()}
                      </div>
                      <span className={styles.email}>{email}</span>
                      <button className={styles.assignButton} onClick={() => handleChange(email)}>
                        Assign
                      </button>
                    </div>
                  </ListboxOption>
                ))
              ) : (
                <div className={styles.noAssignees}>No assignees available</div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default UserList;
