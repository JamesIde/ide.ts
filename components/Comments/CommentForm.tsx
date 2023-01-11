function CommentForm() {
  return (
    <div className="flex flex-row p-2 justify-center">
      <div className="mt-2 rounded-full w-[85%]">
        <textarea
          name=""
          id=""
          className="w-full h-24 border-[1px] rounded-md pl-2"
          rows={10}
          placeholder="Leave a message..."
        />
      </div>
      <div className="w-max pl-2">
        <button className="mx-auto flex items-center mt-2 pl-4 pr-4 pt-2 pb-2 text-white font-semibold bg-blue-700 hover:bg-blue-900 hover:cursor-pointer hover:duration-500 rounded-lg">
          Post
        </button>
      </div>
    </div>
  );
}
export default CommentForm;
