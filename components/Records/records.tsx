import SafeAreaView from "components/SafeAreaView/safeAreaView";
import { IThumbnail } from "../../@types/generated/contentful";
import RecordThumbnail from "./recordThumbnail";

export default function Records({ records, displayHeroRecord }: { records: IThumbnail[]; displayHeroRecord: boolean }) {
  if (displayHeroRecord) {
    records = records.filter((r) => r.fields.slug === process.env.NEXT_PUBLIC_DISPLAY_RECORD_SLUG);
  }

  records.sort((a, b) => {
    const dateA = new Date(a.fields.posted);
    const dateB = new Date(b.fields.posted);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <SafeAreaView>
      <div className="mx-auto xl:w-[40%] lg:w-[70%] md:w-[70%] h-auto mt-20">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="text-xs font-mono uppercase tracking-wider">
            {displayHeroRecord ? "Latest" : "All"} Records
          </div>
          <div className="h-px flex-1 bg-border bg-black" />
        </div>
        <div className="grid grid-cols-1 gap-3 ">
          {records.map((record) => {
            return <RecordThumbnail record={record} key={record.sys.id} />;
          })}
        </div>
      </div>
    </SafeAreaView>
  );
}
