import { IEntries } from "../../@types/generated/contentful";
import Link from "next/link";
export default function EntryThumbnail({ entry }: { entry: IEntries }) {
  return (
    <>
      <div className="xl:w-[45%] lg:w-full md:w-full mb-8 mx-auto">
        <div className="flex flex-col justify-between md:flex-row">
          <Link href={`entries/${entry?.fields.slug}`}>
            <h4 className="w-[90%] mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100 hover:text-orange-700">
              {entry?.fields?.title}
            </h4>
          </Link>
          <p className="w-32 mb-4 text-left text-gray-500 md:text-right md:mb-0">
            {new Date(entry?.fields?.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {entry?.fields?.blurb}
        </p>
      </div>
    </>
  );
}
