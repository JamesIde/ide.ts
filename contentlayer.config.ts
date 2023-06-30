import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import { rehypePrettyCodeOptions } from "./lib/code-styling/rehype";
/**
 * This config fine defines some validation for the mdx files
 * And also the shape of the mdx files
 * And things like location
 */
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `projects/**/*.mdx`, // This is the location of the mdx files
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    date: {
      type: "string",
      description: "The date of the post",
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      // Replaces the .mdx with nothing to form the slug
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "data",
  documentTypes: [Post],
  mdx: {
    esbuildOptions(options) {
      options.target = "esnext"
      return options
    },
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});
