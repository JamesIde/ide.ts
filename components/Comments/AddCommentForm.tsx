import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { addCommentToRecord } from "../../lib/api/api";
import { notify, validateComment } from "../../lib/toastr/Notify";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail";
import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import AddCommentLoader from "../Misc/AddCommentLoader";

function CommentForm({ contentfulId }: { contentfulId: string }) {
  const queryClient = useQueryClient();
  const [emailNotify, setEmailNotify] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { mutate, isLoading } = useMutation({
    mutationFn: addCommentToRecord,
    onSuccess: () => {
      setEmailNotify(false);
      setEditorState(EditorState.createEmpty());
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
    const comment = convertToHTML(editorState.getCurrentContent());
    const isValid = validateComment(comment);
    if (isValid) {
      mutate({
        contentfulId,
        message: comment,
        emailNotify: emailNotify,
      });
    }
  }

  return (
    <>
      <div className="mt-4 mb-3">
        <DraftailEditor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Add a comment..."
          blockTypes={[
            { type: BLOCK_TYPE.HEADER_ONE },
            { type: BLOCK_TYPE.HEADER_TWO },
            { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
            { type: BLOCK_TYPE.UNSTYLED },
          ]}
          inlineStyles={[
            { type: INLINE_STYLE.BOLD },
            { type: INLINE_STYLE.ITALIC },
          ]}
        />
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
              setEmailNotify((prevEmailNotify) => !prevEmailNotify)
            }
            checked={emailNotify}
          />
          <p className="pl-1 mt-[1px]">Notify me of replies</p>
        </div>
      </div>
    </>
  );
}
export default CommentForm;
