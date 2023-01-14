import { CommentType } from "../../@types/Comment";
import { HiPencilAlt } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useStore } from "../../lib/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentFromRecord } from "../../lib/api/api";
import { useEffect, useState } from "react";
import { notify } from "../../lib/toastr/Notify";
import { commentStore } from "../../lib/store/commentStore";
import axios, { AxiosError } from "axios";
import ReplyCommentForm from "./ReplyCommentForm";
import IconLoader from "../Misc/IconLoader";
import UpdateCommentForm from "./UpdateCommentForm";
import HandleCommentDate from "./HandleCommentDate";
import Image from "next/image";

function Comment({
  comment,
  hasChildren,
}: {
  comment: CommentType;
  hasChildren: boolean;
}) {
  const [isActionCompleted, setIsActionCompleted] = commentStore((state) => [
    state.isActionCompleted,
    state.setIsActionCompleted,
  ]);
  const [toggleReply, setToggleReply] = useState(false);
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isActionCompleted) {
      setToggleReply(false);
      setToggleUpdate(false);
    }
  }, [isActionCompleted]);

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

  function toggleReplyEditor() {
    setToggleReply(!toggleReply);
    setIsActionCompleted(!isActionCompleted);
    setToggleUpdate(false);
  }

  function toggleUpdateEditor() {
    setToggleUpdate(!toggleUpdate);
    setIsActionCompleted(!isActionCompleted);
    setToggleReply(false);
  }

  return (
    <div
      style={{
        borderLeft: hasChildren ? "1px solid #ccc" : "none",
      }}
    >
      {" "}
      <div
        style={{
          marginLeft: hasChildren ? "1rem" : "0",
        }}
      >
        {" "}
        {/*Do the main styling on this div */}
        <div className="border-[1px] border-grey-200 p-2 pt-3 pb-3 mb-4 rounded">
          <div className="flex flex-row justify-between ">
            <div className="flex flex-row ">
              <Image
                src={comment.user.picture}
                width={40}
                height={40}
                alt={comment.user.id}
                style={{ objectFit: "contain" }}
              />
              <div className="flex flex-col pl-2">
                <p className="font-semibold">{comment.user.name} </p>
                <HandleCommentDate
                  createdAt={comment.createdAt}
                  updatedAt={comment.updatedAt}
                />
              </div>
            </div>
            <div>
              {user && (
                <div className="flex flex-row justify-end">
                  <div className="p-1">
                    {!toggleReply ? (
                      <FaReply
                        className="cursor-pointer"
                        color="blue"
                        onClick={() => toggleReplyEditor()}
                      />
                    ) : (
                      <AiOutlineCloseCircle
                        color="red"
                        className="cursor-pointer"
                        onClick={() => toggleReplyEditor()}
                      />
                    )}
                  </div>
                  {user.id === comment.user.id && (
                    <>
                      <div className="p-1">
                        {!toggleUpdate ? (
                          <HiPencilAlt
                            className="cursor-pointer"
                            color="green"
                            onClick={() => toggleUpdateEditor()}
                          />
                        ) : (
                          <AiOutlineCloseCircle
                            color="red"
                            className="cursor-pointer"
                            onClick={() => toggleUpdateEditor()}
                          />
                        )}
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
        {toggleUpdate && <UpdateCommentForm comment={comment} />}
        {toggleReply && <ReplyCommentForm comment={comment} />}
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
