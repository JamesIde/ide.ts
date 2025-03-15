import { getContentfulEntries } from "lib/api/contentful";
import Helmet from "../../components/Navigation/Helmet";
import Records from "components/Records/records";
import { IThumbnail } from "interfaces/generated/contentful";

function AllRecords({ records }: { records: IThumbnail[] }) {
  return (
    <>
      <Helmet title="multi-day hikes" />
      <Records records={records} />
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
