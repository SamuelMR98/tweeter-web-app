import { BasePagingPresenter, PagingView } from "./BasePagingPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface StatusView extends PagingView<Status> {}

export class StatusPresenter extends BasePagingPresenter<Status, StatusView> {
  loadMoreItems(arg0: AuthToken, arg1: User, PAGE_SIZE: number) {
    throw new Error("Method not implemented.");
  }
  setLastItem(arg0: null) {
    throw new Error("Method not implemented.");
  }
  private service = new StatusService();

  protected async loadPage(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStatuses(authToken, user, pageSize, lastItem);
  }
}
