import Link from "next/link";
import { IPhotoCollection } from "../../@types/generated/contentful";
import CDNImage from "components/Image/CDNImage";
export default function PhotoCollectionThumbnail({ collection }: { collection: IPhotoCollection }) {
  return (
    <div className="grid grid-cols-1 mb-4 p-2">
      <div className="px-6 py-2">
        <div className="mb-1 mx-auto text-[20px] text-[#343a40] leading-6 font-semibold text-center hover:text-orange-500 thumbnail-title">
          <Link href={`collections/${collection.fields.slug}`}>{collection.fields.title}</Link>
        </div>
        <p className="text-center text-sm text-gray-600">
          {new Date(collection?.fields?.date as string).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <Link href={`collections/${collection.fields.slug}`}>
        <CDNImage
          height={1920}
          width={1080}
          alt={collection.fields?.title}
          url={`collections/${collection.fields.slug}/${collection.fields.featuredImage.fields.file.fileName}`}
        />
      </Link>
    </div>
  );
}
