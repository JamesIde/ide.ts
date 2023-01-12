import CommentForm from "./CommentForm";
import { useStore } from "../../lib/store/userStore";
import { retrieveAllRecordComments } from "../../lib/api/api";
import GoogleLoginButton from "../Google/GoogleLoginButton";
import { useQuery } from "@tanstack/react-query";
import { CommentType } from "../../@types/Comment";
import axios, { AxiosError } from "axios";
import Comments from "./Comments";
function CommentWrapper({
  contentfulId,
  recordTitle,
}: {
  contentfulId: string;
  recordTitle: string;
}) {
  const user = useStore((state) => state.user);
  const {
    data: comments,
    isLoading,
    isError,
    isSuccess,
    error = {} as AxiosError,
  } = useQuery<CommentType[], AxiosError>(
    ["comments"],
    () => retrieveAllRecordComments(contentfulId),
    {
      onSuccess: (data) => {
        console.log(data);
      },
      refetchOnWindowFocus: false,
    }
  );

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

      {comments?.length > 0 && (
        <div className="flex flex-row">
          <h5 className="font-playfair text-xl pb-4">
            View {comments?.length}{" "}
            {comments?.length === 1 ? "comment" : "comments"} for {recordTitle}
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
        (comments.length > 0 ? (
          <Comments comments={comments} />
        ) : (
          <p>No comments found</p>
        ))}
    </div>
  );
}
export default CommentWrapper;
