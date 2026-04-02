import loader from "@/assets/loader.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Image
        src={loader}
        alt="Loading..."
        width={150}
        height={150}
        priority
        className="w-10 h-auto"
      />
    </div>
  );
}
