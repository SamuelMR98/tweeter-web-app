import React, { useState, useEffect } from "react";
import { AuthToken, Status } from "tweeter-shared";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../hooks/useUserInfo";
import { StatusPresenter, StatusView } from "../../presenters/StatusPresenter";
import useUserNavigation from "../hooks/userNavigationHook";

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

const StatusItemScroller: React.FC<StatusItemScrollerProps> = ({ errorMessage }) => {
  const { displayErrorMessage } = useToastListener();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { displayedUser, authToken } = useUserInfo();
  const { navigateToUser } = useUserNavigation();

  const statusView: StatusView = {
    addItems: (newStatuses: Status[]) => setStatuses((prev) => [...prev, ...newStatuses]),
    setHasMoreItems: (flag: boolean) => setHasMore(flag),
    displayErrorMessage: (msg: string) => displayErrorMessage(msg),
  };

  const presenter = new StatusPresenter(statusView);

  useEffect(() => {
    // Reset when the displayed user changes.
    setStatuses([]);
    presenter.setLastItem(null);
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser]);

  const loadMore = async () => {
    try {
      await presenter.loadMoreItems(authToken!, displayedUser!, PAGE_SIZE);
    } catch (error) {
      displayErrorMessage(`${errorMessage}: ${error}`);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        dataLength={statuses.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {statuses.map((status, index) => (
          <StatusItem key={index} item={status} navigateToUser={navigateToUser} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
