import { AuthToken, User, Status } from "tweeter-shared";
import { FakeData } from "tweeter-shared";

export class StatusService {
  public async loadMoreStatuses(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await new Promise((res) => setTimeout(res, 2000)); // Simulate server call
    FakeData.instance.fakeStatuses.push(newStatus);
  }
}