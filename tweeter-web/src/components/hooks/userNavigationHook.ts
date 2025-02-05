import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import useToastListener from "../toaster/ToastListenerHook";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";

const useUserNavigation = () => {
    const { setDisplayedUser, currentUser, authToken } = useContext(UserInfoContext);
    const { displayErrorMessage } = useToastListener();
  
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
      // TODO: Replace with the result of calling server
      return FakeData.instance.findUserByAlias(alias);
    };
  
    return { navigateToUser };
  };
  
  export default useUserNavigation;