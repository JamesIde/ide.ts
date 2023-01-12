import { CommentType } from "../../@types/Comment";
import Image from "next/image";
import { HiPencilAlt } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { useStore } from "../../lib/store/userStore";
function Comment({
  comment,
  hasChildren,
}: {
  comment: CommentType;
  hasChildren: boolean;
}) {
  const user = useStore((state) => state.user);
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
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
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
              {user && user.id === comment.user.id && (
                <div className="flex flex-row justify-end">
                  <div className="p-1">
                    <HiPencilAlt className="cursor-pointer" color="blue" />
                  </div>
                  <div className="p-1">
                    <MdDeleteOutline className="cursor-pointer" color="red" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="pt-2 pl-2">{comment.message}</p>
          </div>
        </div>
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
