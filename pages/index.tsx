import {
  IBanner,
  IEntries,
  IPhotoCollection,
  IThumbnail,
} from "../@types/generated/contentful";
import Layout from "../components/navigation-seo/Layout";
import Navigation from "../components/navigation-seo/Navigation";
import Records from "../components/records/Records";
import { getContentfulEntries } from "../lib/contentful";
import Image from "next/image";
import Entries from "../components/entries/Entries";
import PhotoCollection from "../components/PhotoCollection/PhotoCollection";

export async function getStaticProps() {
  const cBanner = await getContentfulEntries("banner");
  const cEntries = await getContentfulEntries("entries");
  const cRecords = await getContentfulEntries("thumbnail");
  const cPhotos = await getContentfulEntries("photoCollection");
  return {
    props: {
      entries: cEntries.items,
      records: cRecords.items,
      photos: cPhotos.items,
    },
  };
}

export default function Home({
  entries,
  records,
  photos,
}: {
  entries: IEntries[];
  records: IThumbnail[];
  photos: IPhotoCollection[];
}) {
  return (
    <Layout>
      <Navigation />
      <Records records={records} />
      <Entries entries={entries} />
      <PhotoCollection photos={photos} />
    </Layout>
  );
}

{
  /* <p className="font-bold text-red-500">Hello World</p>
      {entries.map((banner) => {
        return (
          <>
            <Image
              src={`https:${banner.fields.Banner?.fields.file?.url}`}
              width={1920}
              height={1080}
              alt={banner.fields.bannerDescription!}
              loading="lazy"
              key={banner.fields.bannerDescription}
            />
          </>
        );
      })} */
}
