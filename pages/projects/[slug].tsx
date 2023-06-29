import Layout from "../../components/Navigation/Layout";
import Helmet from "../../components/Navigation/Helmet";
import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import { notFound } from "next/navigation";

import { allPosts, Post } from "contentlayer/generated";

const PostPage = ({ post }) => {
  console.log(post);
  const Component = useMDXComponent(post.body.code);
  const MDXComponents = {
    BannerImage: (props) => {
      console.log(props);
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
      console.log(props);
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
  // const MDXComponents = {
  //   Image: Image,
  // };
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

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post) {
    return notFound();
  } else {
    return {
      props: {
        post,
      },
    };
  }
};

export const getStaticPaths = () => {
  const paths = allPosts.map((post) => ({
    params: { slug: post.slug }, // Match the dynamic route parameter name
  }));
  console.log(paths);
  return {
    paths,
    fallback: false,
  };
};
