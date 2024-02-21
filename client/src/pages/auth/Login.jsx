import { useTitle, useAuthContext } from '@hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormUi, FormFields } from '@layouts';
import { registerOptions } from '@utils';
import { userService } from '@services';

//UseContext in react
//uselocation to know the path that ure on
//useNavigate is used to redirect ur user to another page

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  useTitle('Login to PINSHOT');

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const onFormSubmit = async (data) => {
    console.log(data)
  }

  return (
    <FormUi
      title="Welcome, Login"
      info="Don't have an account"
      to="/signup"
      path="Sign Up"
      btnText="Login"
      onSubmit = {handleSubmit(onFormSubmit)}
      isSubmitting = {isSubmitting}
    >
      <FormFields
        register={register}
        errors={errors?.userName}
        registerOptions={registerOptions?.userName}
        className="my-4 text-black"
        id="userName"
        label="Username"
        name="userName"
        type="text"
        placeholder="username"
      />

      <FormFields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-1 text-black position-relative"
        id="password"
        label="Password"
        name="Password"
        type="password"
        placeholder="password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />

      <div
        className="w-100 text-end my-2"
        style={{ color: 'var(--orangeLight)', fontWeight: 500 }}
      >
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
    </FormUi>
  );
}
