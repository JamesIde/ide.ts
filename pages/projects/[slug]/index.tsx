import Layout from "../../../components/Navigation/Layout";
import Helmet from "../../../components/Navigation/Helmet";
import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";

import { Post, allPosts } from "contentlayer/generated";
import { GetStaticProps } from "next";

const PostPage = ({ post }) => {
  const Component = useMDXComponent(post.body.code);
  const MDXComponents = {
    BannerImage: (props) => {
      return (
        <>
          <Image
            src={props.src}
            alt={props.alt}
            quality={100}
            width={600}
            height={500}
            className="mx-auto"
          />
        </>
      );
    },
    Image: (props) => {
      return (
        <>
          <Image
            src={props.src}
            alt={props.alt}
            quality={100}
            width={300}
            height={500}
          />
        </>
      );
    },
  };
  return (
    <Layout>
      <Helmet title={post.title} />
      
      <div className="mt-4 xl:w-2/5 lg:w-3/5 md:w-4/5 w-full mx-auto p-3 justify ">
        <header className="mb-2">
          <h1 className="font-bold text-3xl text-center font-nova">
            {post.title.toUpperCase()}
          </h1>
          <p className="text-center font-nova">Posted on {post.date}</p>
        </header>
        <Component components={MDXComponents} />
      </div>
    </Layout>
  );
};
export default PostPage;

export const getStaticProps: GetStaticProps<{
  post: Post
}> = ({ params }) => ({
  props: { post: allPosts.find((post) => post.slug === params?.slug) },
})

export const getStaticPaths = () => ({
  paths: allPosts.map((post) => ({ params: { slug: post.slug } })),
  fallback: false,
})
