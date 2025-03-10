import Link from "next/link";
import Image from "next/image";
import { IPhotoCollection } from "../../@types/generated/contentful";

export default function PhotoCollectionThumbnail({ collection }: { collection: IPhotoCollection }) {
  return (
    <>
      <div className="container ">
        <div className="ml-5 mr-5 border-[1px]">
          <Link href={`${collection.fields.slug}`}>
            <Image
              alt={collection.fields.title!}
              src={`https:${collection.fields.featuredImage?.fields.file.url}`}
              width={1200}
              height={800}
              priority={true}
            />
          </Link>
          <div className="px-6 py-4 max-w-fit mx-auto ">
            <div className="mb-1 max-w-fit mx-auto thumbnail-title text-[1.5rem] text-[#343a40] leading-6 font-semibold text-center hover:text-orange-500">
              <Link href={`records/${collection.fields.slug}`}>{collection.fields.title}</Link>
            </div>
            <div>
              <p className="text-center">
                Posted:{" "}
                {new Date(collection?.fields?.date as string).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
