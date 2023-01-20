import { CommentType } from "../../@types/Comment";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToComment } from "../../lib/api/api";
import { notify, validateComment } from "../../lib/toastr/Notify";
import axios, { AxiosError } from "axios";
import AddCommentLoader from "../Misc/AddCommentLoader";
import { commentStore } from "../../lib/store/commentStore";
function ReplyCommentForm({ comment }: { comment: CommentType }) {
  const [isActionCompleted, setIsActionCompleted] = commentStore((state) => [
    state.isActionCompleted,
    state.setIsActionCompleted,
  ]);
  const ref = useRef(null);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: replyToComment,
    onSuccess: () => {
      ref.current.value = "";
      queryClient.refetchQueries(["comments"]);
      notify("success", "Reply posted successfully");
      setIsActionCompleted(false);
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        notify("error", error.response?.data);
      } else {
        notify("error", error.message);
      }
    },
  });

  function handleReply() {
    const isValid = validateComment(ref.current.value);
    if (isValid) {
      mutate({
        contentfulId: comment.recordId,
        message: ref.current.value,
        commentId: comment.id,
      });
    }
  }

  return (
    <div className="ml-2 border-l-2 p-2 mb-2">
      <div className="flex flex-row justify-center">
        <div className="mt-2 rounded-full w-full">
          <textarea
            name=""
            id=""
            className="w-full h-24 border-[1px] rounded-md pl-2 p-2"
            rows={10}
            placeholder={`Reply to ${comment.user.name}...`}
            ref={ref}
          />
        </div>
      </div>
      <div className="w-max">
        <button
          type="submit"
          className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-700 hover:bg-blue-900 hover:cursor-pointer duration-500 rounded-lg text-sm"
          onClick={handleReply}
        >
          {isLoading ? <AddCommentLoader /> : "Reply"}
        </button>
      </div>
    </div>
  );
}
export default ReplyCommentForm;
