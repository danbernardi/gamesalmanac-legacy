'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { Game } from '@/lib/types';
import { Group } from "@/lib/data";
import { motion } from "framer-motion";
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function ReleaseDateCards ({ groupedGames }: { groupedGames: Group }): React.ReactNode {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <ul>
      {Object.keys(groupedGames).map((isoDate: string) => {
        const entry = groupedGames[isoDate];
        const date = new Date(isoDate);

        return (
          <motion.li
            key={isoDate}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 40 }}
            viewport={{ once: true, amount: 0, margin: '100px' }}
          >
            <Card className="mb-3">
              <CardHeader className="top-0 sticky rounded-tl-lg rounded-tr-lg bg-card border-tl border-tr shadow-sm px-4 py-3 sm:py-4 sm:px-6">
                <CardTitle id={`${date.getMonth()}-${date.getDay()}-${date.getFullYear()}`} className="text-lg">
                  {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                {entry.games.map((game: Game) => (
                  <div key={game.id} className="p-4 sm:py-4 sm:px-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -ml-4 sm:-ml-6 odd:bg-secondary/40 flex items-center justify-between">
                    <div className="grid grid-cols-[45px,1fr] sm:grid-cols-[57px,1fr] items-center">
                      <div className="overflow-hidden rounded-sm mr-3 flex-shink-0">
                        {game?.cover?.url ? (
                          <Image
                            width={45}
                            height={45}
                            className="max-w-full max-h-full"
                            src={`https:${game.cover.url}`}
                            alt={`Cover thumbnail for ${game.name}`}
                            unoptimized
                          />
                        ) : (
                          <div className="h-[33px] sm:h-[45px] bg-secondary-foreground/20" />
                        )}
                      </div>
                      <div className="text-sm sm:tex-base">
                        <strong className="flex items-center">
                          {game.name}
                        </strong>
                        <span className="text-xs sm:text-sm text-foreground/75">
                          {game?.platforms?.map(plat => plat?.abbreviation || plat.alternative_name || plat.name).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <motion.div
                        className="ml-3"
                        whileHover={ { scale: 0.8 } }
                        whileTap={ { scale: 1.25 } }
                        tabIndex={-1}
                      >
                        <Button
                          size="icon"
                          onClick={() => toggleFavorite(game.id)}
                          variant="ghost"
                          aria-label={ favorites.includes(game.id) ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites` }
                        >
                          <Heart
                            width={20}
                            height={20}
                            fill={ favorites.includes(game.id) ? 'var(--heart)' : 'transparent' }
                            color={ favorites.includes(game.id) ? 'var(--heart)' : '#BBB' }
                          />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.li>
        )
      })}
    </ul>
  )
};
