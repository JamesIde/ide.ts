import SafeAreaView from "components/Misc/safeAreaView";
import { IThumbnail } from "../../@types/generated/contentful";
import RecordThumbnail from "./recordThumbnail";
import LineSeparator from "components/Misc/lineSeparator";
import Link from "next/link";

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
        <div className="pl-2">
          <LineSeparator name={displayHeroRecord ? "Latest Records" : "All Records"} />
        </div>
        <div className="grid grid-cols-1 gap-3 ">
          {records.map((record) => {
            return <RecordThumbnail record={record} key={record.sys.id} />;
          })}
        </div>
        <div className="flex justify-end mt-5 mr-5">
          {displayHeroRecord && (
            <Link href="/records">
              <button className="rounded-xl flex h-9 items-center justify-center bg-gradient-to-b from-gray-900 from-50% to-gray-800 to-50% px-3 text-gray-50 shadow hover:from-gray-800 hover:to-gray-700 active:from-gray-700 active:to-gray-600">
                View All
              </button>
            </Link>
          )}
        </div>
      </div>
    </SafeAreaView>
  );
}
