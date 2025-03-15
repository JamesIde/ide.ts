import { IThumbnail } from "../../interfaces/generated/contentful";
import RecordThumbnail from "./recordThumbnail";

export default function Records({ records }: { records: IThumbnail[] }) {
  records.sort((a, b) => {
    const dateA = new Date(a.fields.posted);
    const dateB = new Date(b.fields.posted);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="mb-2">
      {records.map((record) => {
        return <RecordThumbnail record={record} key={record.sys.id} />;
      })}
    </div>
  );
}
