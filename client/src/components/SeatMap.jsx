const STATE_STYLES = {
  AVAILABLE: "border-white/15 bg-white/5 text-white/70 hover:border-brand-500/70 hover:bg-brand-500/10 cursor-pointer",
  SELECTED: "border-brand-500 bg-brand-500 text-white cursor-pointer",
  LOCKED: "border-white/5 bg-white/5 text-white/20 cursor-not-allowed",
  BOOKED: "border-white/5 bg-ink-700 text-white/15 cursor-not-allowed line-through",
};

export default function SeatMap({ layout, selectedSeats, onToggleSeat }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-lg">
        <div className="mx-auto h-2 w-4/5 rounded-t-full bg-gradient-to-b from-brand-500/60 to-transparent" />
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-white/30">Screen this way</p>
      </div>

      <div className="flex flex-col gap-2">
        {layout.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-2">
            <span className="w-4 text-center text-xs text-white/30">{row[0]?.seatId?.[0]}</span>
            <div className="flex gap-1.5">
              {row.map((seat) => {
                const isSelected = selectedSeats.includes(seat.seatId);
                const state = isSelected ? "SELECTED" : seat.state;
                const disabled = state === "LOCKED" || state === "BOOKED";
                return (
                  <button
                    key={seat.seatId}
                    disabled={disabled}
                    onClick={() => onToggleSeat(seat.seatId)}
                    title={seat.seatId}
                    className={`flex h-7 w-7 items-center justify-center rounded-md border text-[10px] font-medium transition ${STATE_STYLES[state]}`}
                  >
                    {seat.seatId.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
        <Legend swatch="border-white/15 bg-white/5" label="Available" />
        <Legend swatch="border-brand-500 bg-brand-500" label="Selected" />
        <Legend swatch="border-white/5 bg-white/5" label="Held by someone" />
        <Legend swatch="border-white/5 bg-ink-700" label="Booked" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3.5 w-3.5 rounded border ${swatch}`} />
      {label}
    </span>
  );
}
