import { IThumbnail } from "../../@types/generated/contentful";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getRecordBySlug, getRecordSlugs } from "../../lib/api/contentful";
import { useState } from "react";
import { ModalImage } from "../../@types/Modal";
import { Link } from "react-scroll";
import Image from "next/image";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import Modal from "../../components/Modal/Modal";
import Script from "next/script";
import ViewCount from "../../components/Views/ViewCount";
import Mapbox from "components/Mapbox/Mapbox";
import { GPX_MAPPER } from "lib/gpx-mapper/mapper";
import ImageGrid from "components/Records/imageGrid";
import SafeAreaView from "components/Misc/safeAreaView";

export default function Record({ record }: { record: IThumbnail }) {
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

  const markdownConfig: any = {
    components: {
      a: ({ href, children, ...props }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      ),
    },
  };

  const mapRecordDescriptionsByDay = (record: IThumbnail) => {
    const recordDescriptionByDay = [];

    let dayIndex = 1;
    while (record.fields?.[`day${getDayName(dayIndex)}Description`]) {
      recordDescriptionByDay.push({
        description: record.fields[`day${getDayName(dayIndex)}Description`],
        images: record.fields[`imageBlock${dayIndex}`],
      });
      dayIndex++;
    }

    return recordDescriptionByDay;
  };

  const getDayName = (num: number): string => {
    // TODO - if a trip ever exceeds 10 days, this would need to be adjusted.
    // It's because of the original naming of the contentful assets we have to deal with this...
    // The contentful asset nodes don't start at 0 either - no dayZeroDescription.
    const dayNames = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
    return dayNames[num] || num.toString();
  };

  const dayData = mapRecordDescriptionsByDay(record);

  return (
    <SafeAreaView>
      <Layout>
        <Helmet title={record.fields.title!} />
        <div id="global-wrapper" onClick={closeModal}>
          <div className="lg:w-[1100px] sm:w-[600px] overflow-hidden mx-auto text-black mt-10 mb-3 p-2">
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
                  <ReactMarkdown {...markdownConfig}>{record.fields.attributions}</ReactMarkdown>
                </p>
                <hr />
              </div>
            )}
            <div className="record-details">
              <ReactMarkdown>{record.fields?.prefaceDescription}</ReactMarkdown>
              {dayData.map((day, index) => (
                <>
                  <div className="record-stats" key={index}>
                    <ReactMarkdown>{day.description}</ReactMarkdown>
                  </div>
                  <div className="record-grid-container">
                    <ImageGrid images={day.images} onImageClick={imageModal} />
                  </div>
                </>
              ))}
              <div className="record-details mb-2">
                <h1 className="mb-3">GPS</h1>
                <Mapbox line={GPX_MAPPER[record.fields.slug]} />
              </div>
              {record.fields?.travelDescription && (
                <ReactMarkdown {...markdownConfig}>{record.fields?.travelDescription!}</ReactMarkdown>
              )}
              {record.fields?.aboutDescription && (
                <ReactMarkdown {...markdownConfig}>{record.fields?.aboutDescription!}</ReactMarkdown>
              )}
            </div>
            <div className="record-details">
              <h1 className="mb-3 mt-3">Gear</h1>
              <Script src={record.fields.lighterpackLink} />
              <div id={record.fields.lighterpackId}></div>
            </div>
          </div>
          <Link activeClass="active" to="global-wrapper" spy={true} smooth={true} offset={-100} duration={500}>
            <p className="w-max mx-auto hover:cursor-pointer mb-5 font-mono hover:text-orange-500 duration-500">
              Back to top
            </p>
          </Link>

          {modal && <Modal currImage={currImage} id={record.sys.id} onClose={closeModal} />}
        </div>
      </Layout>
    </SafeAreaView>
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
