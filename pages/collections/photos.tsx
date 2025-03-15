import { IPhotoCollection } from "interfaces/generated/contentful";
import { getContentfulEntries } from "lib/api/contentful";
import PhotoCollection from "components/PhotoCollection/photoCollection";
import Helmet from "components/Navigation/Helmet";

export default function Photos({ photos }: { photos: IPhotoCollection[] }) {
  photos.sort((a, b) => {
    const dateA = new Date(a.fields.date);
    const dateB = new Date(b.fields.date);
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <>
      <Helmet title="photos" />
      <PhotoCollection photos={photos} />
    </>
  );
}

export async function getStaticProps() {
  const cPhotos = await getContentfulEntries("photoCollection");

  return {
    props: {
      photos: cPhotos.items,
    },
  };
}
