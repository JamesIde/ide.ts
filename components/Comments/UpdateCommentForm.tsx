import { CommentType } from "../../@types/Comment";
import { useState } from "react";
import { commentStore } from "../../lib/store/commentStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { notify } from "../../lib/toastr/Notify";
import { updateComment } from "../../lib/api/api";
import AddCommentLoader from "../Misc/AddCommentLoader";
function UpdateCommentForm({ comment }: { comment: CommentType }) {
  const queryClient = useQueryClient();
  const [fields, setFields] = useState({ ...comment });
  const [isActionCompleted, setIsActionCompleted] = commentStore((state) => [
    state.isActionCompleted,
    state.setIsActionCompleted,
  ]);

  const { mutate, isLoading } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.refetchQueries(["comments"]);
      notify("success", "Comment updated successfully");
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

  // Gets the new message
  function handleChange(e) {
    setFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  // Handle update
  function handleUpdate() {
    if (fields.message.length < 10) {
      notify(
        "error",
        "New comment cannot be empty. Please ensure it is a minimum 10 characters long."
      );
    } else {
      mutate({ commentId: comment.id, message: fields.message });
    }
  }

  return (
    <div className="ml-2 border-l-2 p-2 mb-4">
      <div className="flex flex-row justify-center">
        <div className="mt-2 rounded-full w-full">
          <textarea
            id=""
            className="w-full h-24 border-[1px] rounded-md pl-2"
            rows={10}
            name="message"
            value={fields.message}
            onChange={handleChange}
          />
        </div>
        <div className="w-max pl-2">
          <button
            type="submit"
            className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-700 hover:bg-blue-900 hover:cursor-pointer duration-500 rounded-lg"
            onClick={handleUpdate}
          >
            {isLoading ? <AddCommentLoader /> : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default UpdateCommentForm;
