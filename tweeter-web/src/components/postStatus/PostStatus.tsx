import "./PostStatus.css";
import { useState } from "react";
import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, Status } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";

const PostStatus = () => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken } = useContext(UserInfoContext);
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await postStatus(authToken!, status);

      setPost("");
      displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  const postStatus = async (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> => {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            id="postStatusTextArea"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            onChange={(event) => {
              setPost(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={checkButtonStatus()}
            style={{ width: "8em" }}
            onClick={(event) => submitPost(event)}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
            className="btn btn-md btn-secondary"
            type="button"
            disabled={checkButtonStatus()}
            onClick={(event) => clearPost(event)}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
