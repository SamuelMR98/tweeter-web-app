import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export interface StatusView {
    addStatuses: (statuses: Status[]) => void;
    setHasMoreStatuses: (hasMore: boolean) => void;
    displayErrorMessage: (message: string) => void;
}

export class StatusPresenter {
    private service = new StatusService();
    public lastStatus: Status | null = null;

    constructor(private view: StatusView) { }

    public async loadMoreStatuses(
        authToken: AuthToken,
        user: User,
        pageSize: number
    ) {
        try {
            const [newStatuses, hasMore] = await this.service.loadMoreStatuses(
                authToken,
                user,
                pageSize,
                this.lastStatus
            );
            this.view.addStatuses(newStatuses);
            this.view.setHasMoreStatuses(hasMore);
            this.lastStatus = newStatuses[newStatuses.length - 1];
        } catch (error) {
            this.view.displayErrorMessage(`Failed to load statuses: ${error}`);
        }
    }
}
