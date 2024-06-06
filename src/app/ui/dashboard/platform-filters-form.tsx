

import { PLATFORMS } from "@/app/lib/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Filters } from "@/app/lib/types";

export default function PlatformFiltersForm({
  filters,
  onPlatformCheck,
  onSubmit,
  disableBtn,
}: { 
  filters: Filters;
  onPlatformCheck: (id: number) => void;
  onSubmit: () => void;
  disableBtn: boolean;
}) {

  return (
    <div>
      <h4 className="mb-3 font-semibold">Select platforms</h4>
      {(PLATFORMS).map((platform) => (
        <div key={platform.id} className="flex items-center flex justify-between [&:not(:last-child)]:border-b hover:text-card-foreground/80 hover:bg-card-foreground/5 -ml-6 w-[calc(100%+3rem)] px-6">
          <Label className="block w-full py-4 cursor-pointer" htmlFor={`toggle-${platform.id}-platform`}>{platform.name}</Label>
          <Switch
            id={`toggle-${platform.id}-platform`}
            checked={filters.platforms.includes(platform.id)}
            onCheckedChange={() => onPlatformCheck(platform.id)}
          />
        </div>
      ))}

      <Button className="w-full mt-6" variant="brand" onClick={onSubmit} size="sm" disabled={disableBtn}>
        Update filters
      </Button>
    </div>
  );
}
