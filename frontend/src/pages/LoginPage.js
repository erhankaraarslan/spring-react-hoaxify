import React, { useEffect, useState } from "react";
import Input from "../components/input";
import { useTranslation } from "react-i18next";
import ButtonWithProggress from "../components/ButtonWithProggress";
import { useDispatch } from "react-redux/es/exports";
import { loginHandler } from "../redux/authActions";
import { useApiProgress } from "../shared/ApiProgress";
const LoginPage = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setError(undefined);
  }, [username, password]);

  const onClikLogin = async (event) => {
    event.preventDefault();

    const creds = {
      username,
      password,
    };

    const { history } = props;
    const { push } = history;
    setError(undefined);
    try {
      await dispatch(loginHandler(creds));
      push("/");
    } catch (apiError) {
      setError(apiError.response.data.message);
    }
  };
  const { t } = useTranslation();
  const pendingApiCall = useApiProgress("post", "/api/1.0/auth");

  const buttonEnabled = username && password;
  return (
    <div className='container'>
      <form>
        <h1 className='text-center'>{t("Login")}</h1>
        <Input
          label={t("Username")}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></Input>
        <Input
          label={t("Password")}
          type='password'
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></Input>
        {error && (
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
        )}
        <div className='text-center'>
          <ButtonWithProggress
            onClick={onClikLogin}
            pendingApiCall={pendingApiCall}
            disabled={!buttonEnabled || pendingApiCall}
            text={t("Login")}
          ></ButtonWithProggress>
        </div>
      </form>
    </div>
  );
};

//const LoginPageWithTranslation = withTranslation()(LoginPage);
//const LoginPageWithApiProggress = withApiProgress(LoginPage, "/api/1.0/auth");

export default LoginPage;
