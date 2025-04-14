import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import { executeWithErrorHandling } from "./presenterHelpers";
import { BaseView } from "./BaseView";

export interface PostStatusView extends BaseView {
  resetPostInput: () => void;
  displayInfoMessage: (message: string, duration?: number) => void;
  clearInfoMessage: () => void;
}

export class PostStatusPresenter {
  private service = new StatusService();

  constructor(private view: PostStatusView) {}

  public async postStatus(
    authToken: AuthToken,
    currentUser: User,
    postText: string
  ) {
    await executeWithErrorHandling(
      async () => {
        this.view.displayInfoMessage("Posting status...", 0);
        const status = new Status(postText, currentUser, Date.now());
        await this.service.postStatus(authToken, status);
        this.view.resetPostInput();
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "Failed to post the status",
      this.view.displayErrorMessage
    );
    this.view.clearInfoMessage();
  }
}
