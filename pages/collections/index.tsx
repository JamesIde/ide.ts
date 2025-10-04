import { IPhotoCollection } from "../../@types/generated/contentful";
import SafeAreaView from "components/Misc/safeAreaView";
import { getContentfulEntries } from "lib/api/contentful";
import Layout from "components/Navigation/Layout";
import PhotoCollection from "components/PhotoCollection/photoCollection";

export async function getStaticProps() {
  const cPhotos = await getContentfulEntries("photoCollection");

  return {
    props: {
      photos: cPhotos.items,
    },
  };
}

function Index({ photos }: { photos: IPhotoCollection[] }) {
  return (
    <Layout>
      <SafeAreaView>
        <PhotoCollection photos={photos} displayHeroRecord={false} />
      </SafeAreaView>
    </Layout>
  );
}

export default Index;
