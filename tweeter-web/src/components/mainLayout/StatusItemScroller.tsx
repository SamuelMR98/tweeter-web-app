import React, { useContext, useState, useEffect } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";

export const PAGE_SIZE = 10;

interface StatusItemScrollerProps {
    loadMoreItemsFunction: (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ) => Promise<[Status[], boolean]>;
    errorMessage: string;
}

const StatusItemScroller: React.FC<StatusItemScrollerProps> = ({ loadMoreItemsFunction, errorMessage }) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<Status[]>([]);
    const [newItems, setNewItems] = useState<Status[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);
    const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

    const { displayedUser, setDisplayedUser, currentUser, authToken } = useContext(UserInfoContext);

    useEffect(() => {
        reset();
    }, [displayedUser]);

    useEffect(() => {
        if (changedDisplayedUser) {
            loadMoreItems();
        }
    }, [changedDisplayedUser]);

    useEffect(() => {
        if (newItems) {
            setItems([...items, ...newItems]);
        }
    }, [newItems]);

    const reset = async () => {
        setItems([]);
        setNewItems([]);
        setLastItem(null);
        setHasMoreItems(true);
        setChangedDisplayedUser(true);
    };

    const loadMoreItems = async () => {
        try {
            const [newItems, hasMore] = await loadMoreItemsFunction(
                authToken!,
                displayedUser!.alias,
                PAGE_SIZE,
                lastItem
            );

            setHasMoreItems(hasMore);
            setLastItem(newItems[newItems.length - 1]);
            setNewItems(newItems);
            setChangedDisplayedUser(false);
        } catch (error) {
            displayErrorMessage(`${errorMessage}: ${error}`);
        }
    };

    const navigateToUser = async (event: React.MouseEvent, alias: string): Promise<void> => {
        event.preventDefault();

        try {
            const user = await getUser(authToken!, alias);

            if (!!user) {
                if (currentUser!.equals(user)) {
                    setDisplayedUser(currentUser!);
                } else {
                    setDisplayedUser(user);
                }
            }
        } catch (error) {
            displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    const getUser = async (authToken: AuthToken, alias: string): Promise<User | null> => {
        return FakeData.instance.findUserByAlias(alias);
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={hasMoreItems}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item, index) => (
                    <StatusItem key={index} item={item} navigateToUser={navigateToUser} />
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default StatusItemScroller;