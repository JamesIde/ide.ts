import { Comment } from "../../@types/Comment";
/**
 * A public function that creates a nested structure of comments based on the complete array of comments.
 * It looks for a parentId in the comment before recursively calling itself to find the children of the comment.
 */
export default function createNestedStructure(
  comments: Comment[],
  parentId: string | null = null
): Comment[] {
  let nestedComments = [];

  let commentCount = 0;
  for (const comment of comments) {
    commentCount++;
    if (comment.parentId === parentId) {
      const children = createNestedStructure(comments, comment.id);
      if (children.length > 0) {
        comment.children = children;
      }
      nestedComments.push(comment);
    }
  }

  return nestedComments;
}
