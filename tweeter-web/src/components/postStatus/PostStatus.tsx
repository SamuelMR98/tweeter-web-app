import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../hooks/useUserInfo";
import { PostStatusPresenter, PostStatusView } from "../../presenters/PostStatusPresenter";

const PostStatus = () => {
  const { currentUser, authToken } = useUserInfo();
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const postStatusView: PostStatusView = {
    displayErrorMessage: (message: string) => displayErrorMessage(message),
    displayInfoMessage: (message: string, duration: number) => displayInfoMessage(message, duration),
    clearInfoMessage: () => clearLastInfoMessage(),
    resetPostInput: () => setPost(""),
  };

  const presenter = new PostStatusPresenter(postStatusView);

  const checkButtonStatus = (): boolean => {
    return !post.trim() || !authToken || !currentUser;
  };

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!checkButtonStatus()) {
      setIsLoading(true);
      await presenter.postStatus(authToken!, currentUser!, post);
      setIsLoading(false);
    }
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  return (
    <div className={isLoading ? "loading" : ""}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            onChange={(event) => setPost(event.target.value)}
          />
        </div>
        <div className="form-group">
          <button
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={checkButtonStatus()}
            onClick={submitPost}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              "Post Status"
            )}
          </button>
          <button
            className="btn btn-md btn-secondary"
            type="button"
            disabled={checkButtonStatus()}
            onClick={clearPost}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
