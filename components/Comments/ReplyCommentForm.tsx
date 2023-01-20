import { CommentType } from "../../@types/Comment";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToComment } from "../../lib/api/api";
import { notify, validateComment } from "../../lib/toastr/Notify";
import { commentStore } from "../../lib/store/commentStore";
import axios, { AxiosError } from "axios";
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "draftail";
import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import AddCommentLoader from "../Misc/AddCommentLoader";

function ReplyCommentForm({ comment }: { comment: CommentType }) {
  const queryClient = useQueryClient();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isActionCompleted, setIsActionCompleted] = commentStore((state) => [
    state.isActionCompleted,
    state.setIsActionCompleted,
  ]);

  const { mutate, isLoading } = useMutation({
    mutationFn: replyToComment,
    onSuccess: () => {
      setEditorState(EditorState.createEmpty());
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
    const commentReply = convertToHTML(editorState.getCurrentContent());
    const isValid = validateComment(commentReply);
    if (isValid) {
      mutate({
        contentfulId: comment.recordId,
        message: commentReply,
        commentId: comment.id,
      });
    }
  }

  const replyPlaceholder = `Reply to ${comment.user.name}...`;
  return (
    <div className="ml-2 border-l-2 p-2 mb-2">
      <DraftailEditor
        editorState={editorState}
        onChange={setEditorState}
        placeholder={replyPlaceholder}
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
