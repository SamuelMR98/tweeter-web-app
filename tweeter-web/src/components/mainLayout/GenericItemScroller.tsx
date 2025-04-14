import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../hooks/useUserInfo";

export interface GenericItemScrollerProps<T> {
    loadMoreItems: (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: T | null
    ) => Promise<[T[], boolean]>;
    itemComponentGenerator: (item: T, index: number) => JSX.Element;
    errorMessage: string;
    pageSize?: number;
}

const GenericItemScroller = <T,>({
    loadMoreItems,
    itemComponentGenerator,
    errorMessage,
    pageSize = 10,
}: GenericItemScrollerProps<T>): JSX.Element => {
    const [items, setItems] = useState<T[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const { authToken, displayedUser } = useUserInfo();

    const loadMore = async () => {
        try {
            const [newItems, moreItems] = await loadMoreItems(
                authToken!,
                displayedUser!,
                pageSize,
                items.length ? items[items.length - 1] : null
            );
            setItems(prev => [...prev, ...newItems]);
            setHasMore(moreItems);
        } catch (error) {
            console.error(`${errorMessage}: ${error}`);
        }
    };

    useEffect(() => {
        // Reset list when displayedUser changes.
        setItems([]);
        loadMore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayedUser]);

    return (
        <div className="container px-0 overflow-visible">
            <InfiniteScroll
                dataLength={items.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item, index) => (
                    <div key={index} className="row mb-3">
                        {itemComponentGenerator(item, index)}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default GenericItemScroller;
