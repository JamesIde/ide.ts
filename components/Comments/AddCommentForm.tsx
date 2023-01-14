import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { addCommentToRecord } from "../../lib/api/api";
import { notify, validateComment } from "../../lib/toastr/Notify";
import AddCommentLoader from "../Misc/AddCommentLoader";

function CommentForm({ contentfulId }: { contentfulId: string }) {
  const queryClient = useQueryClient();
  const [fields, setFields] = useState({
    message: "",
    emailNotify: false,
  });

  const handleUpdate = (e) => {
    // Update the fields form state
    setFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: addCommentToRecord,
    onSuccess: () => {
      setFields({ ...fields, message: "", emailNotify: false });
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
    const isValid = validateComment(fields.message);
    if (isValid) {
      mutate({
        contentfulId,
        message: fields.message,
        emailNotify: fields.emailNotify,
      });
    }
  }
  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="mt-2 rounded-full w-full">
          <textarea
            id=""
            className="w-full h-24 border-[1px] rounded-md pl-2 p-2"
            rows={10}
            placeholder="Add a comment"
            onChange={handleUpdate}
            value={fields.message}
            name="message"
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="w-max">
          <button
            type="submit"
            className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-500 hover:bg-blue-900 hover:cursor-pointer duration-500 rounded-lg"
            onClick={handleNewComment}
          >
            {isLoading ? (
              <AddCommentLoader />
            ) : (
              <p className="text-sm">Add Comment</p>
            )}
          </button>
        </div>
        <div className="flex flex-row p-2 mt-1">
          <input
            type="checkbox"
            name="notifications"
            id="notifications"
            onChange={() =>
              setFields({ ...fields, emailNotify: !fields.emailNotify })
            }
            checked={fields.emailNotify}
          />
          <p className="pl-1 mt-[1px]">Notify me of replies</p>
        </div>
      </div>
    </>
  );
}
export default CommentForm;
