import LineSeparator from "components/Misc/lineSeparator";
import { IPhotoCollection } from "../../@types/generated/contentful";
import PhotoCollectionThumbnail from "./photoCollectionThumbnail";

export default function PhotoCollection({
  photos,
  displayHeroRecord,
}: {
  photos: IPhotoCollection[];
  displayHeroRecord: boolean;
}) {
  if (displayHeroRecord) {
    photos = photos.filter((p) => p.fields.slug === process.env.NEXT_PUBLIC_DISPLAY_PHOTO_COLLECTION_SLUG);
  }

  return (
    <div className="mx-auto xl:w-[40%] lg:w-[70%] md:w-[70%] h-auto">
      <LineSeparator displayHeroRecord={displayHeroRecord} name="Photo Collections" />
      {photos.map((collection) => {
        return <PhotoCollectionThumbnail collection={collection} key={collection.sys.id} />;
      })}
    </div>
  );
}
