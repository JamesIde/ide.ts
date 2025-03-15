import Entries from "components/Entries/entries";
import Helmet from "components/Navigation/Helmet";
import { IEntries } from "interfaces/generated/contentful";
import { getContentfulEntries } from "lib/api/contentful";

function AllEntries({ entries }: { entries: IEntries[] }) {
  return (
    <>
      <Helmet title="entries" />
      <Entries entries={entries} />
    </>
  );
}
export default AllEntries;

export async function getStaticProps() {
  const cEntries = await getContentfulEntries("entries");
  return {
    props: {
      entries: cEntries.items,
    },
  };
}
