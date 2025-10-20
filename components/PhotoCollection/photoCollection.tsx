import LineSeparator from "components/Misc/lineSeparator";
import { IPhotoCollection } from "../../@types/generated/contentful";
import PhotoCollectionThumbnail from "./photoCollectionThumbnail";
import Link from "next/link";

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
      <div className="pl-2">
        <LineSeparator name={displayHeroRecord ? "Latest Photos Collections" : "All Photo Collections"} />
      </div>
      {photos.map((collection) => {
        return <PhotoCollectionThumbnail collection={collection} key={collection.sys.id} />;
      })}
      <div className="flex justify-end mt-5 mr-2 mb-5">
        {displayHeroRecord && (
          <Link href="/collections">
            <button className="rounded-xl flex h-9 items-center justify-center bg-gradient-to-b from-gray-900 from-50% to-gray-800 to-50% px-3 text-gray-50 shadow hover:from-gray-800 hover:to-gray-700 active:from-gray-700 active:to-gray-600">
              View All
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
