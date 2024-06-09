
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader } from "../ui/loader";

export default function NoData ({ message }: { message: string }) {
  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle>
          Games
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message}
        <div className="flex w-full h-[200px] items-center">
          <Loader variant="pong" theme="dark" />
        </div>
      </CardContent>
    </Card>
  );
};
