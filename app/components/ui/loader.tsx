import { cn } from '@/lib/utils';
import './loader.css';

function Loader ({ variant, theme }: { variant: 'blocks' | 'pong', theme: 'light' | 'dark' }) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className={cn(variant, theme)} />
    </div>
  );
}

export { Loader };