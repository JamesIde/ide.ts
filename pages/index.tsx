import { IBanner, IEntries, IPhotoCollection, IThumbnail } from "../@types/generated/contentful";
import Records from "../components/Records/records";
import { getContentfulEntries, seedContentfulRecords } from "../lib/api/contentful";
import Entries from "../components/Entries/entries";
import PhotoCollection from "../components/PhotoCollection/photoCollection";
import Helmet from "../components/Navigation/Helmet";
import Navigation from "../components/Navigation/Navigation";
import Mapbox from "components/Mapbox/Mapbox";
export async function getStaticProps() {
  const cEntries = await getContentfulEntries("entries");
  const cRecords = await getContentfulEntries("thumbnail");
  const cPhotos = await getContentfulEntries("photoCollection");
  const cBanner = await getContentfulEntries("banner");

  if (process.env.NODE_ENV === "production") {
    await seedContentfulRecords(cRecords.items as IThumbnail[]);
  }

  return {
    props: {
      entries: cEntries.items,
      records: cRecords.items,
      photos: cPhotos.items,
      banner: cBanner.items[0],
    },
  };
}

export default function Home({
  entries,
  records,
  photos,
  banner,
}: {
  entries: IEntries[];
  records: IThumbnail[];
  photos: IPhotoCollection[];
  banner: IBanner;
}) {
  return (
    <>
      <Helmet title="Home" />
      <Navigation color="black" />
      <Mapbox />
      {/* <Banner banner={banner} /> */}
      {/* <Records records={records} />
      <PhotoCollection photos={photos} />
      <Entries entries={entries} /> */}
    </>
  );
}
