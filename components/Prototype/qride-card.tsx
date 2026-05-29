type QRideCardProps = {
  mini?: boolean;
  active?: boolean;
};

export function QRideCard({ mini, active }: QRideCardProps) {
  return (
    <div
      className={[
        "relative shrink-0 overflow-hidden border bg-[linear-gradient(135deg,#1a1a1a_0%,#2d0508_55%,#1a1a1a_100%)] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]",
        mini ? "h-[70px] w-[112px] p-3" : "h-[130px] w-[206px] p-4",
        active ? "border-primary shadow-[0_0_28px_rgba(159,7,18,0.38)]" : "border-white/10",
      ].join(" ")}
    >
      <svg
        className="absolute right-0 top-0 opacity-20"
        width={mini ? 74 : 130}
        height={mini ? 74 : 130}
        viewBox="0 0 130 130"
        aria-hidden="true"
      >
        {[18, 36, 54, 72, 90, 110].map((radius) => (
          <circle
            key={radius}
            cx="130"
            cy="0"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div
            className={[
              "flex items-center justify-center rounded-full bg-primary font-black text-primary-foreground",
              mini ? "size-5 text-[9px]" : "size-7 text-xs",
            ].join(" ")}
          >
            Q
          </div>
          {active ? (
            <div className="flex gap-1">
              {[0, 1, 2].map((item) => (
                <span
                  key={item}
                  className="size-1 bg-primary"
                  style={{ animation: `prototype-pulse 1.2s ease-in-out ${item * 0.18}s infinite` }}
                />
              ))}
            </div>
          ) : null}
        </div>
        {mini ? (
          <div className="text-[10px] tracking-[0.1em] text-white/55">•••• 3090</div>
        ) : (
          <div>
            <div className="mb-1 text-[11px] tracking-[0.18em] text-white/72">
              6037 9975 9598 3090
            </div>
            <div className="text-[10px] text-white/45">Exp 09/28</div>
          </div>
        )}
      </div>
    </div>
  );
}
