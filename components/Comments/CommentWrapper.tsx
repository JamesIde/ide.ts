import CommentAuth from "./CommentAuth";
import CommentForm from "./CommentForm";
import { useStore } from "../../lib/store/userStore";
function CommentWrapper() {
  const user = useStore((state) => state.user);
  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
      <div>
        <h5 className="font-playfair text-xl p-2">Comments</h5>
      </div>
      {user ? <CommentForm /> : <CommentAuth />}
    </div>
  );
}
export default CommentWrapper;
