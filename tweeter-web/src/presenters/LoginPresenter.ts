import { AuthService } from "../model/service/AuthService";
import { AuthToken, User } from "tweeter-shared";
import { executeWithErrorHandling } from "./presenterHelpers";
import { BaseView } from "./BaseView";

export interface LoginView extends BaseView {
    updateUserInfo: (
        user: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: (path: string) => void;
}

export class LoginPresenter {
    private service = new AuthService();

    constructor(private view: LoginView) { }

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string
    ) {
        await executeWithErrorHandling(
            async () => {
                const [user, authToken] = await this.service.login(alias, password);
                this.view.updateUserInfo(user, user, authToken, rememberMe);
                this.view.navigate(originalUrl || "/");
            },
            "Failed to log user in because of exception",
            this.view.displayErrorMessage
        );
    }
}
