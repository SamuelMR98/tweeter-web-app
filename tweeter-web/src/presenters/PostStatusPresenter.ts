import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearInfoMessage: () => void;
    resetPostInput: () => void;
}

export class PostStatusPresenter {
    private view: PostStatusView;
    private service = new StatusService();

    constructor(view: PostStatusView) {
        this.view = view;
    }

    public async postStatus(authToken: AuthToken, currentUser: User, postText: string) {
        try {
            this.view.displayInfoMessage("Posting status...", 0);
            const status = new Status(postText, currentUser, Date.now());
            await this.service.postStatus(authToken, status);
            this.view.resetPostInput();
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to post the status: ${error}`);
        } finally {
            this.view.clearInfoMessage();
        }
    }
}
