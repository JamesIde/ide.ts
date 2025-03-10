import { IPhotoCollection } from "@types/generated/contentful";
import { getContentfulEntries } from "lib/api/contentful";
import PhotoCollection from "components/PhotoCollection/photoCollection";

export default function Photos({ photos }: { photos: IPhotoCollection[] }) {
  photos.sort((a, b) => {
    const dateA = new Date(a.fields.date);
    const dateB = new Date(b.fields.date);
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <div className="grid grid-cols-1 gap-3 w-1/3">
      <PhotoCollection photos={photos} />
    </div>
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
