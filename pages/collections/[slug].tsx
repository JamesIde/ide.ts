import { IPhotoCollection } from "../../@types/generated/contentful";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import { getPhotoCollectionBySlug, getPhotoCollectionSlugs } from "../../lib/api/contentful";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import { useState } from "react";
import { ModalImage } from "../../@types/Modal";
import Modal from "../../components/Modal/Modal";
export default function Collection({ collection }: { collection: IPhotoCollection }) {
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
      url: `https:${photo.fields.file.url}`,
      width: photo.fields.file.details.image?.width,
      height: photo.fields.file.details.image?.height,
      description: photo.fields.description,
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
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 mx-auto lg:w-3/5 px-2">{children}</p>,
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
    },
  };
  return (
    <Layout>
      <Helmet title={collection.fields.title!} />
      <div className="mx-auto mb-4" onClick={closeModal}>
        <div className="m-2 xl:w-[65%] lg:w-[65%] md:w-[65%] mx-auto pl-4 pr-4">
          <div className="mb-1 mx-auto font-playfair text-[20px] text-[#343a40] font-semibold text-center ">
            {collection.fields.title}
          </div>
          <p className="text-center text-sm text-gray-600 mb-1">
            {new Date(collection.fields.date!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {documentToReactComponents(collection.fields.main!, options)}
        </div>
        <div className="collection-grid-container">
          <div className="collection-grid pl-4 pr-4">
            {collection.fields.photos.map(function (photo) {
              if (
                (photo.fields.file.details.image?.height >= 4000 && photo.fields.file.details.image?.width < 6000) ||
                (photo.fields.file.details.image?.height >= 3000 && photo.fields.file.details.image?.width < 3000)
              ) {
                return (
                  <Image
                    src={`https:${photo.fields.file.url}`}
                    alt={photo.fields.description}
                    className="border-2 collection-img-span2 hover:border-blue-500 hover:cursor-pointer duration-500"
                    width={500}
                    height={1000}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    quality={100}
                    key={photo.sys.id}
                    onClick={(e) => imageModal(e, photo)}
                  />
                );
              } else {
                return (
                  <Image
                    src={`https:${photo.fields.file.url}`}
                    alt={photo.fields.description}
                    className="border-2 collection-img hover:border-blue-500 hover:cursor-pointer duration-500"
                    width={1000}
                    height={500}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    quality={100}
                    key={photo.sys.id}
                    onClick={(e) => imageModal(e, photo)}
                  />
                );
              }
            })}
          </div>
          {modal && <Modal currImage={currImage} id={collection.sys.id} />}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const collection = await getPhotoCollectionBySlug(params.slug);
  return {
    props: {
      collection,
    },
  };
}

export async function getStaticPaths() {
  const slugs = await getPhotoCollectionSlugs();
  return {
    paths: slugs,
    fallback: false,
  };
}
