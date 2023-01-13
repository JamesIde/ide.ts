import { useStore } from "../../lib/store/userStore";
import { retrieveAllRecordComments } from "../../lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { CommentRetrievalSuccess } from "../../@types/Comment";
import { notify } from "../../lib/toastr/Notify";
import axios, { AxiosError } from "axios";
import GoogleLoginButton from "./GoogleLoginButton";
import CommentForm from "./AddCommentForm";
import Comments from "./Comments";
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
    notify("success", "Signout successfully");
  }

  return (
    <div className="xl:w-[50%] md:w-4/5 w-full mx-auto p-2">
      <div>
        <h5 className="font-playfair text-xl">Leave a comment</h5>
        <p className="mt-1 text-sm text-gray-500 italic">
          {!user ? (
            <> Sign in through Google to comment. </>
          ) : (
            <>Signed in as {user.email}. </>
          )}
        </p>
        <p className="mt-1 text-sm text-gray-500 italic">
          Your email address will not be published.
        </p>
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
          className="mt-2 ml-auto p-2 border-[1px] text-red-700 border-red-800 hover:bg-red-800 duration-500 w-min hover:cursor-pointer rounded hover:text-white font-bold"
          onClick={() => handleSignout()}
        >
          Signout
        </div>
      )}
    </div>
  );
}
export default CommentWrapper;
