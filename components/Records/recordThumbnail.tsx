import CDNImage from "components/Image/CDNImage";
import { IThumbnail } from "../../@types/generated/contentful";
import Link from "next/link";
function RecordThumbnail({ record }: { record: IThumbnail }) {
  return (
    <div className=" ml-5 mr-5 border-[1px]">
      <Link href={`records/${record.fields.slug}`}>
        <CDNImage
          height={1920}
          width={1080}
          alt={record.fields?.description}
          url={`records/${record.fields.slug}/${record.fields.featuredImage.fields.file.fileName}`}
        />
      </Link>
      <div className="px-6 py-4 max-w-fit mx-auto ">
        <div className="mb-1 max-w-fit mx-auto thumbnail-title text-[1.5rem] text-[#343a40] leading-6 font-semibold text-center hover:text-orange-500">
          <Link href={`records/${record.fields.slug}`}>{record.fields.title}</Link>
        </div>
        <div>
          <p className="text-center mb-3 mt-2 font-mono">[{record.fields.location}]</p>
          <hr className="mb-5" />
          <p className="text-base">{record.fields.description}</p>
          <p className="text-right ">{record.fields.date}</p>
        </div>
      </div>
    </div>
  );
}
export default RecordThumbnail;
