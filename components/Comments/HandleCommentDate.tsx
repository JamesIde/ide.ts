function HandleCommentDate({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date;
}) {
  return (
    <>
      {createdAt === updatedAt ? (
        <p className="xl:text-sm text-xs text-gray-400">
          Posted:{" "}
          {new Date(createdAt).toLocaleDateString("en-AU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      ) : (
        <p className="xl:text-sm text-xs text-gray-400">
          Updated:{" "}
          {new Date(updatedAt).toLocaleDateString("en-AU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </>
  );
}
export default HandleCommentDate;
