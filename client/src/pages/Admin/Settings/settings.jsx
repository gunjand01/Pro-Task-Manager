import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, User, Mail } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button";
import { AuthContext } from "../../context/AuthProvider";
import styles from "./settings.module.css";

const schema = yup
  .object({
    name: yup.string(),
    newMail: yup.string().email("Invalid email format"), // Added email validation
    newPassword: yup
      .string()
      .min(6, "Password should be at least 6 characters"), // Added password validation
    oldPassword: yup.string().required("Old password is required"), // Added required validation
  })
  .required();

const defaultValues = {
  name: "",
  newMail: "",
  oldPassword: "",
  newPassword: "",
};

export default function Settings() {
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const { user, updateInfo, logout } = useContext(AuthContext); // Added logout function from context
  const navigate = useNavigate(); // Initialize useHistory for redirection

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        console.log(errJson);
        const { errors } = errJson;

        for (const property in errors) {
          setError(property, { type: "custom", message: errors[property] });
        }

        throw new Error(errJson.message);
      }

      toast.success("Successfully updated info!");
      setIsSafeToReset(true);
      await updateInfo();

      // Log out and redirect to the register page
      logout();
      navigate("/register");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!isSafeToReset) return;

    reset(defaultValues); // asynchronously reset your form values
  }, [reset, isSafeToReset]);

  return (
    <div className={styles.container}>
      <p className={styles.heading}>
        Settings
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          error={errors.name}
          label="name"
          register={register}
          placeholder={user?.info?.name || "Name"}
          mainIcon={<User />}
        />
        <FormInput
          error={errors.newMail}
          label="newMail"
          register={register}
          secondaryIcon={<Mail />}
          placeholder={user?.info?.email || "Update Email"}
          mainIcon={<User />}
          type="email"
        />
        <FormInput
          error={errors.oldPassword}
          label="oldPassword"
          register={register}
          placeholder={"Old Password"}
          secondaryIcon={<Eye />}
          mainIcon={<User />}
          type="password"
        />
        <FormInput
          error={errors.newPassword}
          label="newPassword"
          register={register}
          placeholder={"New Password"}
          mainIcon={<User />}
          secondaryIcon={<Eye />}
          type="password"
        />

        <Button>{isSubmitting ? "Updating..." : "Update"}</Button>
      </form>
    </div>
  );
}
