function LineSeparator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4 mb-4 md:pl-0">
      <div className="text-xs font-mono uppercase tracking-wider">{name}</div>
      <div className="h-px flex-1 bg-border bg-black" />
    </div>
  );
}
export default LineSeparator;
