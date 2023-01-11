import { CommentType } from "../../@types/Comment";
function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className="pl-2 border-l-2">
      <div>{comment.message}</div>
      {comment.children &&
        comment.children.map((child) => {
          return <Comment comment={child} key={child.id} />;
        })}
    </div>
  );
}
export default Comment;
