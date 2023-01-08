import {
  IEntries,
  IPhotoCollection,
  IThumbnail,
} from "../@types/generated/contentful";
import Navigation from "../components/Navigation/Navigation";
import Records from "../components/Records/records";
import { getContentfulEntries, seedContentfulRecords } from "../lib/contentful";
import Entries from "../components/Entries/entries";
import PhotoCollection from "../components/PhotoCollection/photoCollection";
import Helmet from "../components/Navigation/Helmet";
import GoogleLoginButton from "../components/Google/GoogleLoginButton";
export async function getStaticProps() {
  const cEntries = await getContentfulEntries("entries");
  const cRecords = await getContentfulEntries("thumbnail");
  const cPhotos = await getContentfulEntries("photoCollection");

  try {
    await seedContentfulRecords(cRecords.items as IThumbnail[]);
  } catch (error) {
    // Hard fail if we can't seed the database at build time
    process.exit(1);
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
      <GoogleLoginButton />
      <Helmet title="Home" />
      <Navigation />
      <Records records={records} />
      <PhotoCollection photos={photos} />
      <Entries entries={entries} />
    </>
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
