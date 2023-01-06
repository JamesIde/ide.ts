import { IThumbnail } from "../../@types/generated/contentful";
import RecordThumbnail from "./recordThumbnail";

export default function Records({ records }: { records: IThumbnail[] }) {
  records.sort((a, b) => {
    const dateA = new Date(a.fields.posted);
    const dateB = new Date(b.fields.posted);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div>
      <h1 className="text-center text-3xl mb-1 mt-4 nav-center text-bold heading">
        LATEST RECORDS
      </h1>
      <div className="mx-auto xl:w-[35%] lg:w-[70%] md:w-[70%] h-auto mt-5 mb-5">
        <div className="grid grid-cols-1 gap-3 ">
          {records.map((record) => {
            return <RecordThumbnail record={record} key={record.sys.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
