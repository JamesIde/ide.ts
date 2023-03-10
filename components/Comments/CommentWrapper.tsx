import { useStore } from "../../lib/store/userStore";
import { retrieveAllRecordComments } from "../../lib/api/api";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CommentRetrievalSuccess } from "../../@types/Comment";
import { notify } from "../../lib/toastr/Notify";
import GoogleLoginButton from "./GoogleLoginButton";
import CommentForm from "./AddCommentForm";
import Comments from "./Comments";
import { commentStore } from "../../lib/store/commentStore";
import Signout from "./Signout";
function CommentWrapper({
  contentfulId,
  recordTitle,
}: {
  contentfulId: string;
  recordTitle: string;
}) {
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);
  const [commentCount, setCommentCount] = commentStore((state) => [
    state.commentCount,
    state.setCommentCount,
  ]);
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
      onSuccess: (data) => {
        setCommentCount(data.commentCount);
      },
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

  return (
    <>
      <hr className="xl:w-[50%] md:w-4/5 w-full mx-auto" />
      <div className="xl:w-[40%] md:w-4/5 w-full mx-auto p-2 mb-5 mt-3">
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
        <Signout />
      </div>
    </>
  );
}
export default CommentWrapper;
