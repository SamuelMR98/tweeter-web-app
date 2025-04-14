import React, { useState, useEffect } from "react";
import { AuthToken, User } from "tweeter-shared";
import InfiniteScroll from "react-infinite-scroll-component";
import UserItem from "../userItem/UserItem";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../hooks/useUserInfo";
import { UserItemPresenter, UserItemView } from "../../presenters/UserItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  loadItems: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ) => Promise<[User[], boolean]>;
  itemDescription: string;
}

const UserItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { displayedUser, authToken } = useUserInfo();

  const userItemView: UserItemView = {
    addItems: (newItems: User[]) => setItems((prev) => [...prev, ...newItems]),
    setHasMoreItems: (flag: boolean) => setHasMore(flag),
    displayErrorMessage: (msg: string) => displayErrorMessage(msg),
  };

  const presenter = new UserItemPresenter(userItemView);

  useEffect(() => {
    setItems([]);
    presenter['lastItem'] = null;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser]);

  const loadMore = async () => {
    try {
      await presenter.loadMoreItems(authToken!, displayedUser!, PAGE_SIZE);
    } catch (error) {
      displayErrorMessage(`Failed to load ${props.itemDescription}: ${error}`);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
            <UserItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
