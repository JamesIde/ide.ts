import { IEntries } from "../../@types/generated/contentful";
import Helmet from "../../components/navigation-seo/helmet";
import Layout from "../../components/navigation-seo/layout";
import { getBlogEntryBySlug, getBlogEntrySlugs } from "../../lib/contentful";
import Image from "next/image";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useState } from "react";
import { ModalImage } from "../../@types/modals";
export default function Entry({ entry }: { entry: IEntries }) {
  const [modal, setModal] = useState(false);
  const [currImage, setImage] = useState<ModalImage>({
    url: "",
    width: "",
    height: "",
    description: "",
  });

  const imageModal = (e: any, photo: any) => {
    e.stopPropagation();
    setModal((showModal) => !showModal);

    let modalImage: ModalImage = {
      url: `https:${photo.url}`,
      width: photo.details.image.width,
      height: photo.details.image.height,
    };

    setImage(modalImage);
  };
  const closeModal = () => {
    setModal(false);
  };
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <b className="font-bold">{text}</b>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="mb-4 mx-auto lg:w-3/5 px-2">{children}</p>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <h4 className="text-xl font-bold mb-3 mx-auto lg:w-3/5 px-2">
          {children}
        </h4>
      ),
      [INLINES.HYPERLINK]: (node, children) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noreferrer"
          className="italic text-orange-800 hover:text-cyan-500 duration-500"
        >
          {children}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { fields, description, height, width } = node.data.target;

        if (height > 3500 && width < 4700) {
          // Portrait
          return (
            <Image
              className="m-[5px] w-[30%] py-auto cursor-pointer"
              width={fields.file.details.image.width}
              height={fields.file.details.image.height}
              src={`https:${fields.file.url}`}
              alt={fields.description}
              loading="lazy"
              onClick={(e) => imageModal(e, fields.file)}
            />
          );
        } else if (width > 7000) {
          // Panorama
          return (
            <Image
              className="mb-2 w-full cursor-pointer border-2 mx-auto"
              width={fields.file.details.image.width}
              height={fields.file.details.image.height}
              src={`https:${fields.file.url}`}
              alt={fields.description}
              loading="lazy"
              onClick={(e) => imageModal(e, fields.file)}
            />
          );
        } else {
          // Landscape
          return (
            <Image
              className="w-full xl:mx-1 mx-[2px] cursor-pointer flex mb-4"
              width={fields.file.details.image.width}
              height={fields.file.details.image.height}
              src={`https:${fields.file.url}`}
              alt={fields.description}
              loading="lazy"
              onClick={(e) => imageModal(e, fields.file)}
            />
          );
        }
      },
    },
  };

  return (
    <Layout>
      <Helmet title={entry.fields.title} />
      <div className="xl:w-[65%] lg:w-full md:w-[65%] overflow-hidden mx-auto text-black mt-2 px-2">
        <div className="py-2 mx-auto ">
          <div className="mb-1 mx-auto font-playfair text-[20px] text-black font-semibold text-center ">
            {entry.fields.title}
          </div>
          <p className="text-center text-sm text-gray-600">
            {new Date(entry.fields.date!).toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {documentToReactComponents(entry.fields.main, options)}
      </div>

      {modal && (
        <div
          className="fixed flex justify-center items-center h-screen top-0 left-0 bg-blurred flex-col"
          onClick={closeModal}
        >
          <div>
            <Image
              src={currImage.url}
              className="cursor-pointer  h-[96vh] object-contain"
              alt={entry.sys.id}
              key={entry.sys.id}
              width={parseInt(currImage.width)}
              height={parseInt(currImage.height)}
              loading="eager"
            />
          </div>
          <div>
            <p className="text-white text-center ">{currImage.description}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const entry: IEntries = await getBlogEntryBySlug(params.slug);
  return {
    props: {
      entry,
    },
  };
}
export async function getStaticPaths() {
  const slugs = await getBlogEntrySlugs();
  return {
    paths: slugs,
    fallback: false,
  };
}
