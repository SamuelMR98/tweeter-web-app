import { AuthToken, User } from "tweeter-shared";
import { FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user.alias);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user.alias);
  }

  public async getFollowCounts(
    authToken: AuthToken,
    user: User
  ): Promise<[number, number]> {
    return [
      await FakeData.instance.getFollowerCount(user.alias),
      await FakeData.instance.getFolloweeCount(user.alias),
    ];
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    await new Promise((res) => setTimeout(res, 2000));
    return [await FakeData.instance.getFollowerCount(userToFollow.alias), 0];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[number, number]> {
    await new Promise((res) => setTimeout(res, 2000));
    return [await FakeData.instance.getFollowerCount(userToUnfollow.alias), 0];
  }
}