import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

const FeedScroller: React.FC = () => {
  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <StatusItemScroller
      loadMoreItemsFunction={loadMoreFeedItems}
      errorMessage="Failed to load feed items because of exception"
    />
  );
};

export default FeedScroller;