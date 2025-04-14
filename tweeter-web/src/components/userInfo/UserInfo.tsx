import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../hooks/useUserInfo";
import { UserInfoPresenter, UserInfoView } from "../../presenters/UserInfoPresenter";

const UserInfo = () => {
  const { currentUser, displayedUser, authToken, setDisplayedUser } = useUserInfo();
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();

  const [followerCount, setFollowerCount] = useState(0);
  const [followeeCount, setFolloweeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userInfoView: UserInfoView = {
    updateFollowCounts: (fCount, feCount) => {
      setFollowerCount(fCount);
      setFolloweeCount(feCount);
    },
    updateFollowerStatus: (status) => setIsFollowing(status),
    displayErrorMessage: (msg) => displayErrorMessage(msg),
    displayInfoMessage: (msg) => displayInfoMessage(msg, 0),
  };

  const presenter = new UserInfoPresenter(userInfoView);

  useEffect(() => {
    if (currentUser && displayedUser && authToken) {
      presenter.refreshUserInfo(authToken, currentUser, displayedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser]);

  const switchToLoggedInUser = (event: React.MouseEvent) => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (authToken && displayedUser) {
      setIsLoading(true);
      await presenter.followUser(authToken, displayedUser);
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  const unfollowDisplayedUser = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (authToken && displayedUser) {
      setIsLoading(true);
      await presenter.unfollowUser(authToken, displayedUser);
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      {currentUser && displayedUser && authToken && (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img src={displayedUser.imageUrl} className="img-fluid" width="100" alt="User" />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link to="" onClick={switchToLoggedInUser}>
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <div>
                Followees: {followeeCount} Followers: {followerCount}
              </div>
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollowing ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      onClick={unfollowDisplayedUser}
                    >
                      {isLoading ? "Processing..." : "Unfollow"}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      onClick={followDisplayedUser}
                    >
                      {isLoading ? "Processing..." : "Follow"}
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
