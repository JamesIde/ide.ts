import CommentForm from "./CommentForm";
import { useStore } from "../../lib/store/userStore";
import { RetrieveRecordComments } from "../../lib/api/api";
import GoogleLoginButton from "../Google/GoogleLoginButton";
import { useQuery } from "@tanstack/react-query";
import { CommentType } from "../../@types/Comment";
import axios, { AxiosError } from "axios";
import Comments from "./Comments";
function CommentWrapper({ contentfulId }: { contentfulId: string }) {
  console.log(contentfulId);
  const user = useStore((state) => state.user);
  const {
    data: comments,
    isLoading,
    isError,
    isSuccess,
    error = {} as AxiosError,
  } = useQuery<CommentType[], AxiosError>(
    ["comments"],
    () => RetrieveRecordComments(contentfulId),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
      <div>
        <h5 className="font-playfair text-xl p-2">Comments</h5>
      </div>
      {user ? <CommentForm /> : <GoogleLoginButton />}
      {isLoading && <p>Fetching comments</p>}
      {isError && <>{error.response.data}</>}
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
