import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import useToastListener from "../../toaster/ToastListenerHook";
import useUserInfo from "../../hooks/useUserInfo";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login: React.FC<Props> = ({ originalUrl }) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const loginView: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: (user, displayedUser, authToken, remember) =>
      updateUserInfo(user, displayedUser, authToken, remember),
    navigate: (path: string) => navigate(path),
  };

  const presenter = new LoginPresenter(loginView);

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    setIsLoading(true);
    await presenter.doLogin(alias, password, rememberMe, originalUrl);
    setIsLoading(false);
  };

  const inputFieldGenerator = () => (
    <AuthenticationFields
      alias={alias}
      setAlias={setAlias}
      password={password}
      setPassword={setPassword}
      onKeyDown={loginOnEnter}
    />
  );

  const switchAuthenticationMethodGenerator = () => (
    <div className="mb-3">
      Not registered? <Link to="/register">Register</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
