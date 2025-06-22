import { IThumbnail } from "../interfaces/generated/contentful";
import { getContentfulEntries, seedContentfulRecords } from "../lib/api/contentful";
import Records from "../components/Records/records";
import Helmet from "../components/Navigation/Helmet";
import RecordThumbnail from "components/Records/recordThumbnail";

export async function getStaticProps() {
  const cRecords = await getContentfulEntries("thumbnail");

  if (process.env.NODE_ENV === "production") {
    await seedContentfulRecords(cRecords.items as IThumbnail[]);
  }

  return {
    props: {
      records: cRecords.items,
    },
  };
}

export default function Home({ records }: { records: IThumbnail[] }) {
  return (
    <>
      <Helmet title="Home" />
      <div className=" mx-auto">
        <RecordThumbnail record={records[0]} hrefOverride={`${records[0].fields.slug}`} />
      </div>
    </>
  );
}
