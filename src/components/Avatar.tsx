"use client";

type AvatarProps = {
  username: string;
  color: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
};

const sizeMap = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export function Avatar({ username, color, size = "md", online }: AvatarProps) {
  const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white select-none`}
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full border-2 border-white ${
            online ? "bg-emerald-400" : "bg-slate-400"
          }`}
        />
      )}
    </div>
  );
}
