import Link from "next/link";
import Image from "next/image";

export function LogoMark() {
  return (
    <div className="flex size-8 items-center justify-center">
      <Image
        src="/logo.svg"
        alt=""
        width={32}
        height={32}
        className="size-8"
        priority
      />
    </div>
  );
}

export function Logo() {
  return (
    <Link href="#" className="flex items-center gap-2.5" aria-label="QRide home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold text-foreground">QRide</span>
        <span className="mt-1 h-0.5 w-9 bg-primary" />
      </span>
    </Link>
  );
}
