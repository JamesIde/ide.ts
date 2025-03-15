import { IThumbnail } from "../../interfaces/generated/contentful";
import Image from "next/image";
import Link from "next/link";
function RecordThumbnail({ record, hrefOverride }: { record: IThumbnail; hrefOverride?: string }) {
  var link = hrefOverride != null ? `records/${record.fields.slug}` : `${record.fields.slug}`;
  return (
    <div className="w-full md:w-4/6 mx-auto">
      <div className=" ml-5 mr-5 border-[1px]">
        <Link href={link}>
          <Image
            alt={record.fields?.description!}
            src={`https:${record.fields.featuredImage?.fields.file.url}`}
            width={1200}
            height={800}
            priority={true}
          />
        </Link>
        <div className="px-6 py-4 max-w-fit mx-auto ">
          <div className="mb-1 max-w-fit mx-auto thumbnail-title text-[1.5rem] text-[#343a40] leading-6 font-semibold text-center hover:text-orange-500">
            <Link href={link}>{record.fields.title}</Link>
          </div>
          <div>
            <p className="text-center mb-3 mt-2 font-mono">[{record.fields.location}]</p>
            <hr className="mb-5" />
            <p className="text-base">{record.fields.description}</p>
            <p className="text-right ">{record.fields.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RecordThumbnail;
