import { IPhotoCollection } from "../../interfaces/generated/contentful";
import PhotoCollectionThumbnail from "./photoCollectionThumbnail";

export default function PhotoCollection({ photos }: { photos: IPhotoCollection[] }) {
  return (
    <div className="mb-2">
      {photos.map((collection) => {
        return <PhotoCollectionThumbnail collection={collection} key={collection.sys.id} />;
      })}
    </div>
  );
}
