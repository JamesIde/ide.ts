import { IEntries } from "../../interfaces/generated/contentful";
import EntryThumbnail from "./entrythumbnail";

export default function Entries({ entries }: { entries: IEntries[] }) {
  entries.sort((a, b) => {
    const dateA = new Date(a.fields.date);
    const dateB = new Date(b.fields.date);
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <div className="w-full md:w-4/6 mx-auto mb-2">
      {entries.map((entry) => {
        return <EntryThumbnail entry={entry} key={entry.sys.id} />;
      })}
    </div>
  );
}
