import { IPhotoCollection } from "../../@types/generated/contentful";
import PhotoCollectionThumbnail from "./photoCollectionThumbnail";

export default function PhotoCollection({ photos }: { photos: IPhotoCollection[] }) {
  return (
    <>
      {photos.map((collection) => {
        return <PhotoCollectionThumbnail collection={collection} key={collection.sys.id} />;
      })}
    </>
  );
}
