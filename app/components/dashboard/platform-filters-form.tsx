

import { PLATFORMS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Filters } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PlatformFiltersForm({
  filters,
  onPlatformCheck,
  isActive,
}: { 
  filters: Filters;
  onPlatformCheck: (id: number) => void;
  isActive: boolean;
}) {

  return (
    <div>
      <h4 className="mb-3 font-semibold">Select platforms</h4>
      {(PLATFORMS).map((platform) => (
        <div key={platform.id} className={
          cn(
            'flex items-center flex justify-between [&:not(:last-child)]:border-b -ml-6 w-[calc(100%+3rem)] px-6 cursor-not-allowed',
            { 'hover:text-card-foreground/80 hover:bg-card-foreground/5 cursor-pointer': isActive }
          )
        }>
          <Label
            className={ cn('block w-full py-4 cursor-not-allowed', { 'cursor-pointer': isActive }) }
            htmlFor={`toggle-${platform.id}-platform`}
          >{platform.name}</Label>
          <Switch
            id={`toggle-${platform.id}-platform`}
            checked={filters?.platforms?.includes(platform.id)}
            onCheckedChange={() => onPlatformCheck(platform.id)}
            disabled={!isActive}
          />
        </div>
      ))}
    </div>
  );
}
