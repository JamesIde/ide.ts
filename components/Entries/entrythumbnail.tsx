import { IEntries } from "../../interfaces/generated/contentful";
import Link from "next/link";
export default function EntryThumbnail({ entry }: { entry: IEntries }) {
  return (
    <>
      <div className="m-4">
        <div className="flex flex-col justify-between md:flex-row">
          <Link href={`${entry?.fields.slug}`}>
            <h4 className="text-gray-600 dark:text-gray-400  hover:text-orange-700">{entry?.fields?.title}</h4>
          </Link>
          <p className="w-32 mb-4 text-left text-gray-500 md:text-right md:mb-0">
            {new Date(entry?.fields?.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </>
  );
}
