import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInput';
import Button from '../../../components/Button';
import Form from '../Form';
import styles from './register.module.css';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const schema = yup
  .object({
    name: yup.string('Name is required').required(),
    email: yup
      .string()
      .required('Email is required')
      .matches(emailRegex, { message: 'Email is not valid' }),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })
  .required();

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const navigate = useNavigate();

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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errJson = await res.json();
        console.log(errJson);
        const { errors } = errJson;

        for (const property in errors) {
          setError(property, { type: 'custom', message: errors[property] });
        }

        throw new Error(errJson.message);
      }

      toast.success('Successfully registered!');
      setIsSafeToReset(true);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  //https://stackoverflow.com/questions/62741410/react-hook-form-empty-input-field-after-each-submit
  useEffect(() => {
    if (!isSafeToReset) return;

    reset(defaultValues); // asynchronously reset your form values
  }, [reset, isSafeToReset]);

  return (
    <Form title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          error={errors.name}
          label="name"
          register={register}
          placeholder={'Name'}
          mainIcon={<User />}
        />
        <FormInput
          error={errors.email}
          label="email"
          placeholder={'Email'}
          register={register}
          mainIcon={<Mail />}
        />
        <FormInput
          error={errors.password}
          label={'password'}
          register={register}
          type="password"
          placeholder={'Password'}
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />
        <FormInput
          error={errors.confirmPassword}
          label={'confirmPassword'}
          register={register}
          type="password"
          placeholder={'Confirm Password'}
          mainIcon={<Lock />}
          secondaryIcon={<Eye />}
        />

        <Button>{isSubmitting ? 'Registering...' : 'Register'}</Button>
      </form>
    </Form>
  );
}