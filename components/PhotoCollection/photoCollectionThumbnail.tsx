import Link from "next/link";
import Image from "next/image";
import { IPhotoCollection } from "../../@types/generated/contentful";
export default function PhotoCollectionThumbnail({
  collection,
}: {
  collection: IPhotoCollection;
}) {
  return (
    <div className="mx-auto lg:w-1/3 xl:w-1/3 md:w-2/3 px-4 mt-5 mb-5">
      <div className="grid grid-cols-1">
        <div className="px-6 py-2">
          <div className="mb-1 mx-auto text-[20px] text-[#343a40] leading-6 font-semibold text-center hover:text-orange-500">
            <Link href={`collections/${collection.fields.slug}`}>
              {collection.fields.title}
            </Link>
          </div>
          <p className="text-center text-sm text-gray-600">
            {new Date(collection?.fields?.date as string).toLocaleDateString(
              "en-AU",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>
        <Link href={`collections/${collection.fields.slug}`}>
          <Image
            alt={collection.fields.title!}
            src={`https:${collection.fields.featuredImage?.fields.file.url}`}
            loading="lazy"
            width={1200}
            height={800}
            className="flex mx-auto"
          />
        </Link>
      </div>
    </div>
  );
}
