// UserItemPresenter.ts
import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
    addItems: (items: User[]) => void;
    setHasMoreItems: (hasMore: boolean) => void;
    displayErrorMessage: (message: string) => void;
}

export class UserItemPresenter {
    private service = new FollowService();
    private lastItem: User | null = null;

    constructor(private view: UserItemView) { }

    public async loadMoreItems(
        authToken: AuthToken,
        user: User,
        pageSize: number
    ) {
        try {
            const [newItems, hasMore] = await this.service.loadMoreFollowers(
                authToken,
                user,
                pageSize,
                this.lastItem
            );
            this.view.addItems(newItems);
            this.view.setHasMoreItems(hasMore);
            this.lastItem = newItems[newItems.length - 1];
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to load user items: ${error}`
            );
        }
    }
}
