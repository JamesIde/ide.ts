function LineSeparator({ name, displayHeroRecord }: { name: string; displayHeroRecord: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-6 px-2">
      <div className="text-xs font-mono uppercase tracking-wider">
        {displayHeroRecord ? "Latest" : "All"} {name}
      </div>
      <div className="h-px flex-1 bg-border bg-black" />
    </div>
  );
}
export default LineSeparator;
