import { CommentType } from "../../@types/Comment";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToComment } from "../../lib/api/api";
import { notify, validateComment } from "../../lib/toastr/Notify";
import axios, { AxiosError } from "axios";
import AddCommentLoader from "../Misc/AddCommentLoader";
import { commentStore } from "../../lib/store/commentStore";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
// Dynamic import
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
function ReplyCommentForm({ comment }: { comment: CommentType }) {
  const queryClient = useQueryClient();
  const [isActionCompleted, setIsActionCompleted] = commentStore((state) => [
    state.isActionCompleted,
    state.setIsActionCompleted,
  ]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { mutate, isLoading } = useMutation({
    mutationFn: replyToComment,
    onSuccess: () => {
      queryClient.refetchQueries(["comments"]);
      setEditorState(EditorState.createEmpty());
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
    const comment = convertToHTML(editorState.getCurrentContent());
    const isValid = validateComment(comment);
    if (isValid) {
      mutate({
        contentfulId: comment.recordId,
        message: comment,
        commentId: comment.id,
      });
    }
  }
  const replyTo = `Reply to ${comment.user.name}...`;
  return (
    <div className="ml-2 border-l-2 p-2 mb-2">
      <Editor
        wrapperClassName="wrapperClassName"
        editorClassName="my-custom-editor-class"
        toolbarClassName="my-custom-toolbar-class"
        editorState={editorState}
        placeholder={replyTo}
        onEditorStateChange={setEditorState}
        toolbar={{
          options: ["inline", "list"],
          inline: {
            options: ["bold", "italic"],
          },
          list: {
            options: ["ordered", "unordered"],
          },
        }}
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
