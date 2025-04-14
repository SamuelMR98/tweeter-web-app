import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../hooks/useUserInfo";
import { Buffer } from "buffer";
import { RegisterPresenter, RegisterView } from "../../../presenters/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleImageFile(file);
  };

  const handleImageFile = (file: File | undefined) => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];
        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");
        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
      const fileExtension = file.name.split(".").pop();
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
    }
  };

  const registerView: RegisterView = {
    displayErrorMessage: (message: string) => displayErrorMessage(message),
    updateUserInfo: (user, displayedUser, authToken, remember) => {
      updateUserInfo(user, displayedUser, authToken, remember);
    },
    navigate: (path: string) => navigate(path),
  };

  const presenter = new RegisterPresenter(registerView);

  const doRegister = async () => {
    setIsLoading(true);
    await presenter.doRegister(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension,
      rememberMe
    );
    setIsLoading(false);
  };

  const inputFieldGenerator = () => (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          placeholder="First Name"
          onKeyDown={registerOnEnter}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label>First Name</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          placeholder="Last Name"
          onKeyDown={registerOnEnter}
          onChange={(event) => setLastName(event.target.value)}
        />
        <label>Last Name</label>
      </div>
      <AuthenticationFields
        alias={alias}
        setAlias={setAlias}
        password={password}
        setPassword={setPassword}
        onKeyDown={registerOnEnter}
      />
      <div className="form-floating mb-3">
        <input
          type="file"
          className="form-control"
          onKeyDown={registerOnEnter}
          onChange={handleFileChange}
        />
        <label>User Image</label>
        {imageUrl && <img src={imageUrl} className="img-thumbnail" alt="" />}
      </div>
    </>
  );

  const switchAuthenticationMethodGenerator = () => (
    <div className="mb-3">
      Already registered? <Link to="/login">Sign in</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
