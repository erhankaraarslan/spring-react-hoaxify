import React, { useState } from "react";
import Input from "../components/input";
import { useTranslation } from "react-i18next";
import ButtonWithProggress from "../components/ButtonWithProggress";
import { useDispatch } from "react-redux/es/exports";
import { signupHandler } from "../redux/authActions";
import { useApiProgress } from "../shared/ApiProgress";

const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    username: null,
    displayName: null,
    password: null,
    passwordRepeat: null,
  });

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    setErrors((previousError) => ({ ...previousError, [name]: undefined }));
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };
  const onClickSignUp = async (event) => {
    event.preventDefault();
    const { history } = props;
    const { push } = history;

    const { username, displayName, password } = form;

    const body = {
      username,
      displayName,
      password,
    };

    try {
      await dispatch(signupHandler(body));
      push("/");
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors);
      }
    }
  };

  const { t } = useTranslation();

  const pendingApiCallSignup = useApiProgress("post", "/api/1.0/users");
  const pendingApiCallLogin = useApiProgress("post", "/api/1.0/auth");
  const pendingApiCall = pendingApiCallSignup || pendingApiCallLogin;

  const {
    username: usernameError,
    displayName: displayNameError,
    password: passwordError,
  } = errors;

  let passwordRepeatError;

  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t("Password mismatch");
  }

  return (
    <div className='container'>
      <form>
        <h1 className='text-center'>{t("Sign Up")}</h1>
        <Input
          name='username'
          label={t("Username")}
          error={usernameError}
          onChange={onChange}
        ></Input>
        <Input
          name='displayName'
          label={t("Display Name")}
          error={displayNameError}
          onChange={onChange}
        ></Input>
        <Input
          name='password'
          label={t("Password")}
          type='password'
          error={passwordError}
          onChange={onChange}
        ></Input>
        <Input
          name='passwordRepeat'
          label={t("Password Repeat")}
          type='password'
          error={passwordRepeatError}
          onChange={onChange}
        ></Input>

        <div className='text-center'>
          <ButtonWithProggress
            onClick={onClickSignUp}
            pendingApiCall={pendingApiCall}
            disabled={pendingApiCall || passwordRepeatError !== undefined}
            text={t("Sign Up")}
          ></ButtonWithProggress>
        </div>
      </form>
    </div>
  );
};
// const UserSignupWithApiProggressForSignupRequest = withApiProgress(
//   UserSignupPage,
//   "/api/1.0/users"
// );
// const UserSignupWithApiProggressForAuthRequest = withApiProgress(
//   UserSignupWithApiProggressForSignupRequest,
//   "/api/1.0/auth"
// );

// const UserSignupWithTranslation = withTranslation()(
//   UserSignupWithApiProggressForAuthRequest
// );

export default UserSignupPage;
