import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { addCommentToRecord } from "../../lib/api/api";
import toast from "react-hot-toast";
import { useStore } from "../../lib/store/userStore";
import { notify } from "../../lib/toastr/Notify";
import Loading from "../Misc/IconLoader";
import AddCommentLoader from "../Misc/AddCommentLoader";

function CommentForm({ contentfulId }: { contentfulId: string }) {
  const queryClient = useQueryClient();
  const ref = useRef(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: addCommentToRecord,
    onSuccess: () => {
      ref.current.value = "";
      queryClient.refetchQueries(["comments"]);
      notify("success", "Comment posted successfully");
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        notify("error", error.response?.data);
      } else {
        notify("error", error.message);
      }
    },
  });

  function handleNewComment() {
    // TODO validation && length
    mutate({ contentfulId, message: ref.current.value });
  }

  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="mt-2 rounded-full w-full">
          <textarea
            name=""
            id=""
            className="w-full h-24 border-[1px] rounded-md pl-2"
            rows={10}
            placeholder="Leave a comment..."
            ref={ref}
          />
        </div>
        <div className="w-max pl-2">
          <button
            type="submit"
            className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-500 hover:bg-blue-900 hover:cursor-pointer duration-500 rounded-lg"
            onClick={handleNewComment}
          >
            {isLoading ? <AddCommentLoader /> : "Post"}
          </button>
        </div>
      </div>
    </>
  );
}
export default CommentForm;
