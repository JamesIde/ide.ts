import { IThumbnail } from "../../@types/generated/contentful";
import RecordThumbnail from "./recordThumbnail";

export default function Records({ records }: { records: IThumbnail[] }) {
  records.sort((a, b) => {
    const dateA = new Date(a.fields.posted);
    const dateB = new Date(b.fields.posted);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="grid grid-cols-1 gap-3 ">
      {records.map((record) => {
        return <RecordThumbnail record={record} key={record.sys.id} />;
      })}
    </div>
  );
}
