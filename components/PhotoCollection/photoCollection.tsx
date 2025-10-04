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
    <>
      <div className="mx-auto xl:w-[40%] lg:w-[70%] md:w-[70%] h-auto mt-20">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="text-xs font-mono uppercase tracking-wider">
            {displayHeroRecord ? "Latest" : "All"} Photo Collections
          </div>
          <div className="h-px flex-1 bg-border bg-black" />
        </div>
        {photos.map((collection) => {
          return <PhotoCollectionThumbnail collection={collection} key={collection.sys.id} />;
        })}
      </div>
    </>
  );
}
