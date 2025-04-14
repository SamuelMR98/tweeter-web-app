import { AuthService } from "../model/service/AuthService";
import { AuthToken, User } from "tweeter-shared";
import { executeWithErrorHandling } from "./presenterHelpers";
import { BaseView } from "./BaseView";

export interface RegisterView extends BaseView {
    updateUserInfo: (
        user: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    navigate: (path: string) => void;
}

export class RegisterPresenter {
    private service = new AuthService();

    constructor(private view: RegisterView) { }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        await executeWithErrorHandling(
            async () => {
                const [user, authToken] = await this.service.register(
                    firstName,
                    lastName,
                    alias,
                    password,
                    userImageBytes
                );
                this.view.updateUserInfo(user, user, authToken, rememberMe);
                this.view.navigate("/");
            },
            "Failed to register user because of exception",
            this.view.displayErrorMessage
        );
    }
}
