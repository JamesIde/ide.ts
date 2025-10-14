import { IThumbnail } from "../../@types/generated/contentful";
import Records from "components/Records/records";
import SafeAreaView from "components/Misc/safeAreaView";
import { getContentfulEntries } from "lib/api/contentful";
import Layout from "components/Navigation/Layout";
import Helmet from "components/Navigation/Helmet";

export async function getStaticProps() {
  const cRecords = await getContentfulEntries("thumbnail");

  return {
    props: {
      records: cRecords.items,
    },
  };
}

function Index({ records }: { records: IThumbnail[] }) {
  return (
    <Layout>
      <SafeAreaView>
        <Helmet title="Multiday Trips" />

        <Records records={records} displayHeroRecord={false} />
      </SafeAreaView>
    </Layout>
  );
}

export default Index;
