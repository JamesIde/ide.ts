import { IEntries } from "../../@types/generated/contentful";
import EntryThumbnail from "./EntryThumbnail";

export default function Entries({ entries }: { entries: IEntries[] }) {
  entries.sort((a, b) => {
    const dateA = new Date(a.fields.date);
    const dateB = new Date(b.fields.date);
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <div className=" w-3/4 mx-auto">
      <h1 className="text-center text-xl mb-3 mt-3 nav-center text-bold heading">
        LATEST ENTRIES
      </h1>
      {entries.map((entry) => {
        return <EntryThumbnail entry={entry} key={entry.sys.id} />;
      })}
    </div>
  );
}
