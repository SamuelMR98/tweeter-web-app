import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { executeWithErrorHandling } from "./presenterHelpers";
import { BaseView } from "./BaseView";

export interface UserInfoView extends BaseView {
  updateFollowCounts: (followerCount: number, followeeCount: number) => void;
  updateFollowerStatus: (isFollowing: boolean) => void;
}

export class UserInfoPresenter {
  private service = new UserService();

  constructor(private view: UserInfoView) {}

  public async refreshUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await executeWithErrorHandling(
      async () => {
        if (currentUser.equals(displayedUser)) {
          this.view.updateFollowerStatus(false);
        } else {
          const [followerCount, followeeCount] =
            await this.service.getFollowCounts(authToken, displayedUser);
          this.view.updateFollowCounts(followerCount, followeeCount);
          // (Optional) determine the current following relationship
          this.view.updateFollowerStatus(true);
        }
      },
      "Failed to refresh user info",
      this.view.displayErrorMessage
    );
  }

  public async followUser(authToken: AuthToken, userToFollow: User) {
    await executeWithErrorHandling(
      async () => {
        this.view.displayInfoMessage?.(`Following ${userToFollow.name}...`, 0);
        const [followerCount, followeeCount] = await this.service.follow(
          authToken,
          userToFollow
        );
        this.view.updateFollowCounts(followerCount, followeeCount);
        this.view.updateFollowerStatus(true);
      },
      "Failed to follow user",
      this.view.displayErrorMessage
    );
  }

  public async unfollowUser(authToken: AuthToken, userToUnfollow: User) {
    await executeWithErrorHandling(
      async () => {
        this.view.displayInfoMessage?.(`Unfollowing ${userToUnfollow.name}...`, 0);
        const [followerCount, followeeCount] = await this.service.unfollow(
          authToken,
          userToUnfollow
        );
        this.view.updateFollowCounts(followerCount, followeeCount);
        this.view.updateFollowerStatus(false);
      },
      "Failed to unfollow user",
      this.view.displayErrorMessage
    );
  }
}
