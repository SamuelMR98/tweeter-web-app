import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface UserInfoView {
    updateFollowCounts: (followerCount: number, followeeCount: number) => void;
    updateFollowerStatus: (isFollowing: boolean) => void;
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string) => void;
}

export class UserInfoPresenter {
    private service: UserService;
    private view: UserInfoView;

    constructor(view: UserInfoView) {
        this.view = view;
        this.service = new UserService();
    }

    public async refreshUserInfo(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser.equals(displayedUser)) {
                this.view.updateFollowerStatus(false);
            } else {
                const [followerCount, followeeCount] = await this.service.getFollowCounts(
                    authToken,
                    displayedUser
                );
                this.view.updateFollowCounts(followerCount, followeeCount);
                // For now we set follower status as true (or you can add a dedicated check).
                this.view.updateFollowerStatus(true);
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to refresh user info: ${error}`);
        }
    }

    public async followUser(authToken: AuthToken, userToFollow: User) {
        try {
            this.view.displayInfoMessage(`Following ${userToFollow.name}...`);
            const [followerCount, followeeCount] = await this.service.follow(authToken, userToFollow);
            this.view.updateFollowCounts(followerCount, followeeCount);
            this.view.updateFollowerStatus(true);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to follow user: ${error}`);
        }
    }

    public async unfollowUser(authToken: AuthToken, userToUnfollow: User) {
        try {
            this.view.displayInfoMessage(`Unfollowing ${userToUnfollow.name}...`);
            const [followerCount, followeeCount] = await this.service.unfollow(authToken, userToUnfollow);
            this.view.updateFollowCounts(followerCount, followeeCount);
            this.view.updateFollowerStatus(false);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to unfollow user: ${error}`);
        }
    }
}
