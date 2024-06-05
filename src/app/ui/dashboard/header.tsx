import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Header() {
  return (
    <div className="flex h-full flex-col mt-3">
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          </CardHeader>
      </Card>
    </div>
  );
}
