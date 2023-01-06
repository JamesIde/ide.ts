import { IPhotoCollection } from "../../@types/generated/contentful";
import PhotoCollectionThumbnail from "./photoCollectionThumbnail";

export default function PhotoCollection({
  photos,
}: {
  photos: IPhotoCollection[];
}) {
  console.log("photos", photos);
  return (
    <>
      <h1 className="text-center text-3xl mb-1 mt-3 nav-center text-bold heading">
        LATEST COLLECTIONS
      </h1>
      {photos.map((collection) => {
        return (
          <PhotoCollectionThumbnail
            collection={collection}
            key={collection.sys.id}
          />
        );
      })}
    </>
  );
}
