import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex w-full h-[30vh] items-center">
      <Loader variant="blocks" theme="light" />
    </div>
  );
}
