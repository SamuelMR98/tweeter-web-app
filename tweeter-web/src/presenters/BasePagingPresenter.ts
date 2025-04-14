import { AuthToken, User } from "tweeter-shared";
import { BaseView } from "./BaseView";

export interface PagingView<T> extends BaseView {
    addItems: (items: T[]) => void;
    setHasMoreItems: (hasMore: boolean) => void;
}

export abstract class BasePagingPresenter<T, V extends PagingView<T>> {
    protected lastItem: T | null = null;

    constructor(protected view: V) { }

    // Each subclass implements its own loadPage function.
    protected abstract loadPage(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: T | null
    ): Promise<[T[], boolean]>;

    public async loadMore(authToken: AuthToken, user: User, pageSize: number) {
        try {
            const [newItems, hasMore] = await this.loadPage(
                authToken,
                user,
                pageSize,
                this.lastItem
            );
            this.view.addItems(newItems);
            this.view.setHasMoreItems(hasMore);
            this.lastItem = newItems[newItems.length - 1];
        } catch (error) {
            this.view.displayErrorMessage(`Failed to load items: ${error}`);
        }
    }
}
