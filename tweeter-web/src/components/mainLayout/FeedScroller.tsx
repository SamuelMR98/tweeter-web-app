import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import GenericItemScroller from "./GenericItemScroller";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../hooks/useUserInfo";
import useUserNavigation from "../hooks/userNavigationHook";

const FeedScroller: React.FC = () => {
  const loadMoreFeedItems = async (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const { authToken, displayedUser } = useUserInfo();
  const { navigateToUser } = useUserNavigation();

  const itemComponentGenerator = (status: Status, index: number) => (
    <StatusItem key={index} item={status} navigateToUser={navigateToUser} />
  );

  return (
    <GenericItemScroller
      loadMoreItems={loadMoreFeedItems}
      itemComponentGenerator={itemComponentGenerator}
      errorMessage="Failed to load feed items because of exception"
    />
  );
};

export default FeedScroller;
