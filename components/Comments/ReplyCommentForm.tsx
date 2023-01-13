import { CommentType } from "../../@types/Comment";
import { useRef } from "react";
function ReplyCommentForm({ comment }: { comment: CommentType }) {
  const ref = useRef(null);

  return (
    <div className="ml-2 border-l-2 p-2 mb-4">
      <div className="flex flex-row justify-center">
        <div className="mt-2 rounded-full w-full">
          <textarea
            name=""
            id=""
            className="w-full h-24 border-[1px] rounded-md pl-2"
            rows={10}
            placeholder={`Reply to ${comment.user.name}...`}
            ref={ref}
          />
        </div>
        <div className="w-max pl-2">
          <button
            type="submit"
            className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-700 hover:bg-blue-900 hover:cursor-pointer duration-500 rounded-lg"
            // onClick={() => handleClick()}
          >
            {/* {isLoading ? "Posting..." : "Post"} */}
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
export default ReplyCommentForm;
