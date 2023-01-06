import { IThumbnail } from "../../@types/generated/contentful";
import Image from "next/image";
import Helmet from "../../components/navigation-seo/helmet";
import Layout from "../../components/navigation-seo/layout";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getRecordBySlug, getRecordSlugs } from "../../lib/contentful";
import { useState } from "react";
export default function Record({ record }: { record: IThumbnail }) {
  const [modal, setModal] = useState(false);
  const [currImage, setImage] = useState();
  const imageModal = (e: any, photo: any) => {
    e.stopPropagation();
    setModal((showModal) => !showModal);
    setImage(photo);
  };
  const closeModal = () => {
    setModal(false);
  };
  return (
    <>
      <Layout>
        <Helmet title={record.fields.title!} />
        <div id="global-wrapper">
          <section id="record-details">
            <div className="lg:w-[900px] sm:w-[600px] overflow-hidden mx-auto text-black mt-2 mb-3">
              <Image
                src={`https:${record.fields.featuredImage?.fields.file?.url}`}
                width={1920}
                height={1080}
                alt={record.fields.title!}
                loading="eager"
              />{" "}
              <h1 className="text-xl text-center nav-center heading">
                {record.fields.title}
              </h1>
              <p className="text-center mb-2 mt-2 font-mono">
                [{record.fields.location}]
              </p>
              <p>{record.fields.description}</p>
              <p className="text-right">{record.fields.date}</p>
              <hr className="mb-2 mt-2" />
            </div>
          </section>
          {/* main-wrapper can be a global class for all entries */}
          <div className="">
            <ReactMarkdown>{record.fields?.travelDescription!}</ReactMarkdown>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const record: IThumbnail = await getRecordBySlug(params.slug);
  return {
    props: {
      record,
    },
  };
}

export async function getStaticPaths() {
  const slugs = await getRecordSlugs();
  return {
    paths: slugs,
    fallback: false,
  };
}
