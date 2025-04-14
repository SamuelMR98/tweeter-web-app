import { AuthToken, User } from "tweeter-shared";
import GenericItemScroller from "./GenericItemScroller";
import UserItem from "../userItem/UserItem";
import useUserInfo from "../hooks/useUserInfo";
import useUserNavigation from "../hooks/userNavigationHook";

const UserItemScroller: React.FC<{
  loadItems: (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ) => Promise<[User[], boolean]>;
  itemDescription: string;
}> = ({ loadItems, itemDescription }) => {
  const { authToken, displayedUser } = useUserInfo();
  const { navigateToUser } = useUserNavigation();

  const itemComponentGenerator = (user: User, index: number) => (
    <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
      <UserItem value={user} />
    </div>
  );

  return (
    <GenericItemScroller
      loadMoreItems={loadItems}
      itemComponentGenerator={itemComponentGenerator}
      errorMessage={`Failed to load ${itemDescription}:`}
    />
  );
};

export default UserItemScroller;
