import "./UserInfo.css";
import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useContext(UserInfoContext);

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumbFollowees(authToken!, displayedUser!);
    setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    try {
      if (currentUser === displayedUser) {
        setIsFollower(false);
      } else {
        setIsFollower(
          await getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  const getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  const setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      setFolloweeCount(await getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  const getFolloweeCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  const setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      setFollowerCount(await getFollowerCount(authToken, displayedUser));
    } catch (error) {
      displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  const getFollowerCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      setIsLoading(true);
      displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await follow(
        authToken!,
        displayedUser!
      );

      setIsFollower(true);
      setFollowerCount(followerCount);
      setFolloweeCount(followeeCount);
    } catch (error) {
      displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  const follow = async (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> => {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await getFollowerCount(authToken, userToFollow);
    const followeeCount = await getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      setIsLoading(true);
      displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await unfollow(
        authToken!,
        displayedUser!
      );

      setIsFollower(false);
      setFollowerCount(followerCount);
      setFolloweeCount(followeeCount);
    } catch (error) {
      displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  const unfollow = async (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> => {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
