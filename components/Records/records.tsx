import SafeAreaView from "components/Misc/safeAreaView";
import { IThumbnail } from "../../@types/generated/contentful";
import RecordThumbnail from "./recordThumbnail";
import LineSeparator from "components/Misc/lineSeparator";

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
        <LineSeparator displayHeroRecord={displayHeroRecord} name="Records" />
        <div className="grid grid-cols-1 gap-3 ">
          {records.map((record) => {
            return <RecordThumbnail record={record} key={record.sys.id} />;
          })}
        </div>
      </div>
    </SafeAreaView>
  );
}
