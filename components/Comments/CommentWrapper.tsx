import CommentForm from "./AddCommentForm";
import { useStore } from "../../lib/store/userStore";
import { retrieveAllRecordComments } from "../../lib/api/api";
import GoogleLoginButton from "../Google/GoogleLoginButton";
import { useQuery } from "@tanstack/react-query";
import { CommentRetrievalSuccess, CommentType } from "../../@types/Comment";
import axios, { AxiosError } from "axios";
import Comments from "./Comments";
import { notify } from "../../lib/toastr/Notify";
function CommentWrapper({
  contentfulId,
  recordTitle,
}: {
  contentfulId: string;
  recordTitle: string;
}) {
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const {
    data: comments,
    isLoading,
    isError,
    isSuccess,
    error = {} as AxiosError,
  } = useQuery<CommentRetrievalSuccess, AxiosError>(
    ["comments"],
    () => retrieveAllRecordComments(contentfulId),
    {
      onSuccess: () => {},
      onError: (error: AxiosError | Error) => {
        if (axios.isAxiosError(error)) {
          notify("error", error.response?.data);
        } else {
          notify("error", error.message);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  function handleSignout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto p-2">
      <div>
        <h5 className="font-playfair text-xl">Comments</h5>
      </div>
      {user ? (
        <CommentForm contentfulId={contentfulId} />
      ) : (
        <GoogleLoginButton />
      )}
      <hr className="mt-4 mb-4" />

      {comments?.comments.length > 0 && (
        <div className="flex flex-row">
          <h5 className="font-playfair text-xl pb-4">
            View {comments?.commentCount}{" "}
            {comments?.commentCount === 1 ? "comment" : "comments"} for{" "}
            {recordTitle}
          </h5>
          {/* Drop down with sort TODO */}
          {/* https://www.npmjs.com/package/react-dropdown */}
        </div>
      )}

      {isLoading && <p>Fetching comments</p>}
      {isError && (
        <p className="text-red-500 mx-auto text-sm">
          <>{error.response.data}</>
        </p>
      )}
      {isSuccess &&
        (comments.comments.length > 0 ? (
          <Comments comments={comments.comments} />
        ) : (
          <p>No comments found</p>
        ))}
      <hr />
      {user && (
        <div
          className=" mt-4 text-right bg-red-500 hover:cursor-pointer hover:bg-red-900 w-max flex ml-auto p-2 text-white text-semibold rounded duration-500"
          onClick={() => handleSignout()}
        >
          Signout
        </div>
      )}
    </div>
  );
}
export default CommentWrapper;
