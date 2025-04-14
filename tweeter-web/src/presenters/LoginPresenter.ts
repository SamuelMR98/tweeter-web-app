import { AuthService } from "../model/service/AuthService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        user: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: (path: string) => void;
}

export class LoginPresenter {
    private view: LoginView;
    private service = new AuthService();

    constructor(view: LoginView) {
        this.view = view;
    }

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string
    ) {
        try {
            const [user, authToken] = await this.service.login(alias, password);
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate(originalUrl || "/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    }
}