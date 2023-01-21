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
import { hasCookie } from "cookies-next";
import axios, { AxiosError } from "axios";
import ReplyCommentForm from "./ReplyCommentForm";
import IconLoader from "../Misc/IconLoader";
import HandleCommentDate from "./HandleCommentDate";
import Image from "next/image";
import parse from "html-react-parser";
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
  const [user, setUser] = useStore((state) => [state.user, state.setUser]);

  const queryClient = useQueryClient();
  useEffect(() => {
    const cookie = hasCookie("jid", {
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_PROD_COOKIE_DOMAIN
          : process.env.NEXT_PUBLIC_DEV_COOKIE_DOMAIN,
    });

    if (!cookie) {
      setUser(null);
      sessionStorage.removeItem("user");
    }
    if (!isActionCompleted) {
      setToggleReply(false);
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
          <div className="comment-body">
            <p className="pt-2 pl-2">{parse(comment.message)}</p>
          </div>
        </div>
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
