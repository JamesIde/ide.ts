import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecordViewCount } from "../../lib/api/api";
import { useEffect } from "react";
function ViewCount({ contentfulId }: { contentfulId: string }) {
  useEffect(() => {
    mutate(contentfulId);
  }, []);

  const {
    mutate,
    isLoading,
    data: viewCount,
    isSuccess,
  } = useMutation({
    mutationFn: updateRecordViewCount,
  });

  return (
    <p className="text-rich-indigo text-sm text-right">
      {isSuccess
        ? viewCount.viewCount === 1
          ? viewCount.viewCount + " view"
          : viewCount.viewCount + " views"
        : "--- views"}
    </p>
  );
}

export default ViewCount;
