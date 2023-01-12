import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { addCommentToRecord } from "../../lib/api/api";
function CommentForm({ contentfulId }: { contentfulId: string }) {
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const [commentError, setCommentError] = useState<any>();

  const { mutate, isLoading } = useMutation({
    mutationFn: addCommentToRecord,
    onSuccess: (data) => {
      queryClient.refetchQueries(["comments"]);
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        setCommentError(error.response.data);
      } else {
        setCommentError(error);
      }
    },
  });

  const handleClick = () => {
    mutate({ contentfulId, message: ref.current.value });
  };

  return (
    <div className="flex flex-row justify-center">
      {commentError && (
        <p className="text-sm mx-auto text-red-500">{commentError}</p>
      )}
      <div className="mt-2 rounded-full w-full">
        <textarea
          name=""
          id=""
          className="w-full h-24 border-[1px] rounded-md pl-2"
          rows={10}
          placeholder="Leave a message..."
          ref={ref}
        />
      </div>
      <div className="w-max pl-2">
        <button
          type="submit"
          className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-700 hover:bg-blue-900 hover:cursor-pointer duration-500 rounded-lg"
          onClick={() => handleClick()}
        >
          Post
        </button>
      </div>
    </div>
  );
}
export default CommentForm;
