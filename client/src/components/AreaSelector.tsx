import React from "react";
import { Button } from "./ui/button";

export default function AreaSelector() {
    return (
        <div className="flex gap-4">
            <Button variant={"outline"}>Area 1</Button>
            <Button variant={"outline"}>Area 2</Button>
            <Button variant={"outline"}>Area 3</Button>
            <Button variant={"outline"}>Area 4</Button>
            <Button variant={"outline"}>Area 5</Button>
        </div>
    );
}