'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Filters() {

  return (
    <div className="flex h-full flex-col mt-3">
      <Card className="sticky top-3">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          Filters
        </CardContent>
      </Card>
    </div>
  );
}
