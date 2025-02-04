import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useToastListener from "../toaster/ToastListenerHook";
import OAuth from "../oAuth/OAuth";

interface Props {
  headingText: string;
  submitButtonLabel: string;
  oAuthHeading: string;
  inputFieldGenerator: () => JSX.Element;
  switchAuthenticationMethodGenerator: () => JSX.Element;
  setRememberMe: (value: boolean) => void;
  submitButtonDisabled: () => boolean;
  isLoading: boolean;
  submit: () => void;
}

const AuthenticationFormLayout = (props: Props) => {
  const { displayInfoMessage } = useToastListener();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  return (
    <div className={props.isLoading ? "loading" : ""}>
      <div className="center">
        <div className="form-main w-100 m-auto rounded">
          <form>
            <img
              className="mb-4"
              src="/bird-logo-64.png"
              alt=""
              width="72"
              height="72"
            />
            <h1 className="h3 mb-3 fw-normal">{props.headingText}</h1>

            {props.inputFieldGenerator()}

            <OAuth oAuthHeading={props.oAuthHeading}/>

            <div className="checkbox mb-3">
              <label>
                <input
                  type="checkbox"
                  value="remember-me"
                  onChange={(event) =>
                    props.setRememberMe(event.target.checked)
                  }
                />{" "}
                Remember me
              </label>
            </div>

            {props.switchAuthenticationMethodGenerator()}

            <button
              id="submitButton"
              className="w-100 btn btn-lg btn-primary"
              type="button"
              disabled={props.submitButtonDisabled()}
              onClick={() => props.submit()}
            >
              {props.isLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <div>{props.submitButtonLabel}</div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationFormLayout;
