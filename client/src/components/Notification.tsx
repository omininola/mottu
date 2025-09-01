import * as React from "react";

import { BadgeInfo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function Notification({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Alert
      variant="default"
      className="fixed top-4 right-[50%] translate-x-[50%] w-[300px]"
    >
      <BadgeInfo className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
