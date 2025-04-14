import { BasePagingPresenter, PagingView } from "./BasePagingPresenter";
import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserItemView extends PagingView<User> {}

export class UserItemPresenter extends BasePagingPresenter<User, UserItemView> {
  private service = new FollowService();

  protected async loadPage(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // For example, load followers. Adjust as needed.
    return this.service.loadMoreFollowers(authToken, user, pageSize, lastItem);
  }
}
