import { Ticket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
        <div className="flex items-center gap-2 font-display text-base font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500">
            <Ticket size={16} className="text-white" />
          </span>
          CineBook
        </div>
        <p className="max-w-md text-sm text-white/40">
          Book seats in seconds. Your reservation holds for five minutes while you check out.
        </p> 
      </div>
    </footer>
  );
}
