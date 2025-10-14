import { IPhotoCollection } from "../../@types/generated/contentful";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import { getPhotoCollectionBySlug, getPhotoCollectionSlugs } from "../../lib/api/contentful";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useState } from "react";
import { ModalImage } from "../../@types/Modal";

import SafeAreaView from "components/Misc/safeAreaView";
import CDNImage from "components/Image/CDNImage";
import Modal from "components/Modal/Modal";
export default function Collection({ collection }: { collection: IPhotoCollection }) {
  const [modal, setModal] = useState(false);
  const [currImage, setImage] = useState<ModalImage>({
    url: "",
    width: undefined,
    height: undefined,
    description: undefined,
  });

  const openModal = (e: any, url: string, height: number, width: number, description: string) => {
    e.stopPropagation();
    setModal((showModal) => !showModal);

    let modalImage: ModalImage = {
      url,
      width,
      height,
      description,
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
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 mx-auto xl:w-2/5 px-2">{children}</p>,
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
    <SafeAreaView>
      <Layout>
        <Helmet title={collection.fields.title!} />
        <div className="mx-auto mb-4" onClick={closeModal}>
          <div className="m-2 mx-auto pl-4 pr-4">
            <div className="mb-1 mx-auto text-[20px] text-[#343a40] font-semibold text-center ">
              {collection.fields.title}
            </div>
            <p className="text-center text-sm text-gray-600 mb-5">
              {new Date(collection.fields.date!).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {documentToReactComponents(collection.fields.main!, options)}
          </div>
          <div className="2xl:w-[65%] 2xl:mx-auto w-full">
            <div className="collection-grid-container">
              <div className="collection-grid pl-2 pr-2">
                {collection.fields.photos.map(function (photo) {
                  if (
                    (photo.fields.file.details.image?.height >= 4000 &&
                      photo.fields.file.details.image?.width < 6000) ||
                    (photo.fields.file.details.image?.height >= 3000 && photo.fields.file.details.image?.width < 3000)
                  ) {
                    return (
                      <CDNImage
                        height={1920}
                        width={1080}
                        alt={photo.fields.description}
                        url={`collections/${collection.fields.slug}/${photo.fields.file.fileName}`}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                        className="border-2 collection-img-span2 hover:border-blue-500 hover:cursor-pointer duration-500"
                        onClick={(e) =>
                          openModal(
                            e,
                            `collections/${collection.fields.slug}/${photo.fields.file.fileName}`,
                            1920,
                            1080,
                            photo.fields.description
                          )
                        }
                      />
                    );
                  } else {
                    return (
                      <CDNImage
                        height={2560}
                        width={1440}
                        alt={photo.fields.description}
                        url={`collections/${collection.fields.slug}/${photo.fields.file.fileName}`}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                        className="border-2 collection-img hover:border-blue-500 hover:cursor-pointer duration-500"
                        onClick={(e) =>
                          openModal(
                            e,
                            `collections/${collection.fields.slug}/${photo.fields.file.fileName}`,
                            2560,
                            1440,
                            photo.fields.description
                          )
                        }
                      />
                    );
                  }
                })}
              </div>
              {modal && <Modal currImage={currImage} id={collection.sys.id} onClose={closeModal} />}
            </div>
          </div>
        </div>
      </Layout>
    </SafeAreaView>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const collection: IPhotoCollection = await getPhotoCollectionBySlug(params.slug);
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
