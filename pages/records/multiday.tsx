import { getContentfulEntries } from "lib/api/contentful";
import Helmet from "../../components/Navigation/Helmet";
import { IThumbnail } from "@types/generated/contentful";
import Records from "components/Records/records";

function AllRecords({ records }: { records: IThumbnail[] }) {
  return (
    <>
      <Helmet title="multi-day hikes" />
      <div className="w-1/3">
        <Records records={records} />
      </div>
    </>
  );
}

export default AllRecords;

export async function getStaticProps() {
  const cRecords = await getContentfulEntries("thumbnail");

  return {
    props: {
      records: cRecords.items,
    },
  };
}
