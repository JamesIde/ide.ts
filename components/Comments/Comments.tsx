import { CommentType } from "../../@types/Comment";
import Comment from "./Comment";

function Comments({ comments }: { comments: CommentType[] }) {
  return (
    <>
      {comments.map((comment) => {
        return <Comment comment={comment} key={comment.id} />;
      })}
    </>
  );
}
export default Comments;
