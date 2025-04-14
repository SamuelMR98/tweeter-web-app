import { AuthService } from "../model/service/AuthService";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        user: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: (path: string) => void;
}

export class RegisterPresenter {
    private view: RegisterView;
    private service = new AuthService();

    constructor(view: RegisterView) {
        this.view = view;
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        try {
            const [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                userImageBytes
            );
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate("/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    }
}
