import {
  IEntries,
  IPhotoCollection,
  IThumbnail,
} from "../@types/generated/contentful";
import Navigation from "../components/Navigation/Navigation";
import Records from "../components/Records/records";
import {
  getContentfulEntries,
  seedContentfulRecords,
} from "../lib/api/contentful";
import Entries from "../components/Entries/entries";
import PhotoCollection from "../components/PhotoCollection/photoCollection";
import Helmet from "../components/Navigation/Helmet";
import GoogleLoginButton from "../components/Google/GoogleLoginButton";
import CommentWrapper from "../components/Comments/CommentWrapper";
// import Comments from "../components/Comments/Comments";
export async function getStaticProps() {
  const cEntries = await getContentfulEntries("entries");
  const cRecords = await getContentfulEntries("thumbnail");
  const cPhotos = await getContentfulEntries("photoCollection");

  if (process.env.NODE_ENV === "production") {
    await seedContentfulRecords(cRecords.items as IThumbnail[]);
  }

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
    <>
      <Helmet title="Home" />
      <Navigation />
      <Records records={records} />
      <PhotoCollection photos={photos} />
      <Entries entries={entries} />
    </>
  );
}
