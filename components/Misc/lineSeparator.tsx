function LineSeparator({ name }: { name?: string }) {
  return (
    <div className={`flex items-center mb-4 md:pl-0 ${name ? "gap-4" : ""}`}>
      <div className="text-xs font-mono uppercase tracking-wider">{name}</div>
      <div className="h-px flex-1 bg-border bg-black" />
    </div>
  );
}
// TODO gap-4 if name is present
export default LineSeparator;
