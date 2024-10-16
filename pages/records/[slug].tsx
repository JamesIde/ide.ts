import { IThumbnail } from "../../@types/generated/contentful";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getRecordBySlug, getRecordSlugs } from "../../lib/api/contentful";
import { useState } from "react";
import { ModalImage } from "../../@types/Modal";
import { BiCommentDetail } from "react-icons/bi";
import { Link } from "react-scroll";
import { commentStore } from "../../lib/store/commentStore";
import Image from "next/image";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import Modal from "../../components/Modal/Modal";
import CommentWrapper from "../../components/Comments/CommentWrapper";
import Script from "next/script";
import ViewCount from "../../components/Views/ViewCount";
import WesternArthursWaitList from "components/SignUpWesternArthurs/WesterArthurs";
import { useRouter } from "next/router";

export default function Record({ record }: { record: IThumbnail }) {
  const commentCount = commentStore((state) => state.commentCount);
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

  const router = useRouter();

  const slug = "the-western-arthurs-traverse";

  return (
    <>
      <Layout>
        <Helmet title={record.fields.title!} />
        <div id="global-wrapper" onClick={closeModal}>
          <div className="lg:w-[900px] sm:w-[600px] overflow-hidden mx-auto text-black mt-2 mb-3 p-2">
            <section id="record-details">
              <Image
                src={`https:${record.fields.featuredImage?.fields.file?.url}`}
                width={1920}
                height={1080}
                alt={record.fields.title!}
                loading="eager"
              />{" "}
              <h1 className="text-2xl text-center nav-title mt-4">{record.fields.title}</h1>
              <p className="text-center mb-2 mt-2 font-mono">[{record.fields.location}]</p>
              <p className="mt-2">{record.fields.description}</p>
              <div className="flex justify-between mt-1">
                <div className="flex flex-col items-right ml-auto">
                  <ViewCount contentfulId={record.sys.id} />
                  <p className="text-right">{record.fields?.date}</p>
                </div>
              </div>
              <hr className="mb-2 mt-2" />
            </section>
            {record.fields.attributions && (
              <div id="attributions">
                <p className="text-center pb-2">
                  <ReactMarkdown>{record.fields.attributions}</ReactMarkdown>
                </p>
                <hr />
              </div>
            )}
            <div className="record-details">
              <ReactMarkdown>{record.fields?.prefaceDescription}</ReactMarkdown>
              <div className="record-stats">
                <ReactMarkdown>{record.fields?.dayOneDescription!}</ReactMarkdown>
              </div>
              <div className="record-grid-container">
                <div className="record-grid">
                  {record.fields?.imageBlock1 &&
                    // Applies to all image blocks. The > 5700 is to get portrait X100VI photos filling 2 spots vertically
                    record.fields?.imageBlock1.map(function (photo) {
                      if (
                        (photo.fields.file.details.image?.height! >= 4000 &&
                          photo.fields.file.details.image?.width! === 3024) ||
                        photo.fields.file.details.image?.height > 5700
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            className="record-img-span2 hover:cursor-pointer duration-500"
                            alt={photo.fields.description}
                            width={500}
                            height={1000}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else if (
                        photo.fields.file.details.image?.height! >= 4000 &&
                        photo.fields.file.details.image?.width! === 4000
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer"
                            width={photo.fields.file.details.image?.width}
                            height={photo.fields.file.details.image?.height}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer"
                            width={1920}
                            height={1080}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      }
                    })}
                </div>
              </div>
              <div className="record-stats">
                <ReactMarkdown>{record.fields?.dayTwoDescription!}</ReactMarkdown>
              </div>
              <div className="record-grid-container">
                <div className="record-grid">
                  {record.fields?.imageBlock2 &&
                    record.fields?.imageBlock2.map(function (photo) {
                      if (
                        (photo.fields.file.details.image?.height! >= 4000 &&
                          photo.fields.file.details.image?.width! === 3024) ||
                        photo.fields.file.details.image?.height > 5700
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            className="record-img-span2 hover:cursor-pointer"
                            alt={photo.fields.description}
                            width={500}
                            height={1000}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else if (
                        photo.fields.file.details.image?.height! >= 4000 &&
                        photo.fields.file.details.image?.width! === 4000
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer"
                            width={photo.fields.file.details.image?.width}
                            height={photo.fields.file.details.image?.height}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={1920}
                            height={1080}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      }
                    })}
                </div>
              </div>
              <div className="record-stats">
                <ReactMarkdown>{record.fields?.dayThreeDescription!}</ReactMarkdown>
              </div>
              <div className="record-grid-container">
                <div className="record-grid">
                  {record.fields?.imageBlock3 &&
                    record.fields?.imageBlock3.map(function (photo) {
                      if (
                        (photo.fields.file.details.image?.height! >= 4000 &&
                          photo.fields.file.details.image?.width! === 3024) ||
                        photo.fields.file.details.image?.height > 5700
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            className="record-img-span2 hover:cursor-pointer duration-500"
                            alt={photo.fields.description}
                            width={500}
                            height={1000}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else if (
                        photo.fields.file.details.image?.height! >= 4000 &&
                        photo.fields.file.details.image?.width! === 4000
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={photo.fields.file.details.image?.width}
                            height={photo.fields.file.details.image?.height}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={1920}
                            height={1080}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      }
                    })}
                </div>
              </div>
              <div className="record-stats">
                <ReactMarkdown>{record.fields?.dayFourDescription!}</ReactMarkdown>
              </div>
              <div className="record-grid-container">
                <div className="record-grid">
                  {record.fields?.imageBlock4 &&
                    record.fields?.imageBlock4.map(function (photo) {
                      if (
                        (photo.fields.file.details.image?.height! >= 4000 &&
                          photo.fields.file.details.image?.width! === 3024) ||
                        photo.fields.file.details.image?.height > 5700
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            className="record-img-span2 hover:cursor-pointer duration-500"
                            alt={photo.fields.description}
                            width={500}
                            height={1000}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else if (
                        photo.fields.file.details.image?.height! >= 4000 &&
                        photo.fields.file.details.image?.width! === 4000
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={photo.fields.file.details.image?.width}
                            height={photo.fields.file.details.image?.height}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={1920}
                            height={1080}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      }
                    })}
                </div>
              </div>
              <div className="record-stats">
                <ReactMarkdown>{record.fields?.dayFiveDescription!}</ReactMarkdown>
              </div>
              <div className="record-grid-container">
                <div className="record-grid">
                  {record.fields?.imageBlock5 &&
                    record.fields?.imageBlock5.map(function (photo) {
                      if (
                        (photo.fields.file.details.image?.height! >= 4000 &&
                          photo.fields.file.details.image?.width! === 3024) ||
                        photo.fields.file.details.image?.height > 5700
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            className="record-img-span2 hover:cursor-pointer duration-500"
                            alt={photo.fields.description}
                            width={500}
                            height={1000}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else if (
                        photo.fields.file.details.image?.height! >= 4000 &&
                        photo.fields.file.details.image?.width! === 4000
                      ) {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={photo.fields.file.details.image?.width}
                            height={photo.fields.file.details.image?.height}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      } else {
                        return (
                          <Image
                            src={`https:${photo.fields.file.url}`}
                            alt={photo.fields.description}
                            className="record-img hover:cursor-pointer duration-500"
                            width={1920}
                            height={1080}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            key={photo.sys.id}
                            onClick={(e) => imageModal(e, photo)}
                          />
                        );
                      }
                    })}
                </div>
              </div>

              <h1 className="mb-3">GPS</h1>
              <iframe
                src={record.fields?.map}
                style={{
                  width: "1px",
                  minWidth: "100%",
                  height: "700px",
                  border: "none",
                  marginBottom: "10px",
                }}
              />
              {record.fields?.travelDescription && <ReactMarkdown>{record.fields?.travelDescription!}</ReactMarkdown>}
              {record.fields?.aboutDescription && <ReactMarkdown>{record.fields?.aboutDescription!}</ReactMarkdown>}
            </div>

            <div className="record-details">
              <h1 className="mb-3 mt-3">Gear</h1>
              <Script src={record.fields.lighterpackLink} />
              <div id={record.fields.lighterpackId}></div>
            </div>
          </div>
          {/* TODO Enable */}
          {/* <div id="comments">
            <CommentWrapper
              contentfulId={record.sys.id}
              recordTitle={record.fields.title}
            />
          </div> */}
          <Link activeClass="active" to="global-wrapper" spy={true} smooth={true} offset={-100} duration={500}>
            <p className="w-max mx-auto hover:cursor-pointer mb-5 font-mono hover:text-orange-500 duration-500">
              Back to top
            </p>
          </Link>

          {modal && <Modal currImage={currImage} id={record.sys.id} onClose={closeModal} />}
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
