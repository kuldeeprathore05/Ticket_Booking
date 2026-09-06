import { useCountdown } from "../hooks/useCountdown.js";
import { Clock } from "lucide-react";

export default function CountdownBadge({ deadline, onExpire }) {
   const { label, expired } = useCountdown(deadline);
  const hasFiredRef = useRef(false);   // remembers "did I already announce this?"

  useEffect(() => {
    if (expired && onExpire && !hasFiredRef.current) {
      hasFiredRef.current = true;   // mark as announced — won't fire again
      onExpire();
    }
    if (!expired) {
      hasFiredRef.current = false;  // new reservation started, allow it to fire again later
    }
  }, [expired, onExpire]);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
        expired
          ? "border-red-500/40 bg-red-500/10 text-red-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
      }`}
    >
      <Clock size={14} />
      {expired ? "Reservation expired" : `Reservation expires in ${label}`}
    </div>
  );
}
