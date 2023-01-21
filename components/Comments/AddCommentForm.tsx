import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { addCommentToRecord } from "../../lib/api/api";
import { notify, validateComment } from "../../lib/toastr/Notify";
import AddCommentLoader from "../Misc/AddCommentLoader";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
// Dynamic import
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
function CommentForm({ contentfulId }: { contentfulId: string }) {
  const queryClient = useQueryClient();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [emailNotify, setEmailNotify] = useState(false);

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
      <div className="mt-3">
        <Editor
          wrapperClassName="wrapperClassName"
          editorClassName="my-custom-editor-class"
          toolbarClassName="my-custom-toolbar-class"
          editorState={editorState}
          placeholder="Write your comment here..."
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
