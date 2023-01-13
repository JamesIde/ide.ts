import Image from "next/image";
import { CommentType } from "../../@types/Comment";
import { HiPencilAlt } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useStore } from "../../lib/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentFromRecord } from "../../lib/api/api";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import ReplyCommentForm from "./ReplyCommentForm";
import IconLoader from "../Misc/IconLoader";
import { notify } from "../../lib/toastr/Notify";
function Comment({
  comment,
  hasChildren,
}: {
  comment: CommentType;
  hasChildren: boolean;
}) {
  const [editToggled, setEditToggled] = useState(false);
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteCommentFromRecord,
    onSuccess: (data) => {
      queryClient.refetchQueries(["comments"]);
      notify("success", "Comment deleted successfully");
    },
    onError: (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        notify("error", error.response?.data);
      } else {
        notify("error", error.message);
      }
    },
  });

  function handleDeleteClick(commentId: string) {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? Deleting a comment will delete any replies too."
      )
    ) {
      mutate(commentId);
    }
  }

  function toggleChildEditor() {
    setEditToggled(!editToggled);
  }

  return (
    <div
      style={{
        borderLeft: hasChildren ? "1px solid #ccc" : "none",
      }}
    >
      {" "}
      {/*Apply a border to this class if there are children passed down */}
      <div
        style={{
          marginLeft: hasChildren ? "1rem" : "0",
        }}
      >
        {" "}
        {/*Do the main styling on this div */}
        <div className="border-[1px] border-grey-200 p-2 pt-3 pb-3 mb-4 rounded">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <Image
                src={
                  "https://static.productionready.io/images/smiley-cyrus.jpg"
                }
                width={50}
                height={50}
                alt={comment.user.id}
                style={{ borderRadius: "50%" }}
              />
              <div className="flex flex-col pl-2">
                <p className="font-semibold">{comment.user.name} </p>
                {/* Date */}
                <p className="text-sm text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div>
              {user && (
                <div className="flex flex-row justify-end">
                  <div className="p-1">
                    {!editToggled && (
                      <FaReply
                        className="cursor-pointer"
                        color="blue"
                        onClick={() => setEditToggled((editMode) => !editMode)}
                      />
                    )}
                    {editToggled && (
                      <AiOutlineCloseCircle
                        color="red"
                        className="cursor-pointer"
                        onClick={() => setEditToggled((editMode) => !editMode)}
                      />
                    )}
                  </div>
                  {user.id === comment.user.id && (
                    <>
                      <div className="p-1">
                        <HiPencilAlt className="cursor-pointer" color="blue" />
                      </div>
                      <div
                        className="p-1"
                        onClick={() => handleDeleteClick(comment.id)}
                      >
                        {!isLoading ? (
                          <MdDeleteOutline
                            className="cursor-pointer"
                            color="red"
                          />
                        ) : (
                          <IconLoader />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="pt-2 pl-2">{comment.message}</p>
          </div>
        </div>
        {editToggled && <ReplyCommentForm comment={comment} />}
        {comment.children &&
          comment.children.map((child) => {
            return (
              <Comment comment={child} key={child.id} hasChildren={true} />
            );
          })}
      </div>
    </div>
  );
}
export default Comment;
