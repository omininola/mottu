import AreaSelector from "@/components/AreaSelector";
import SearchBike from "@/components/SearchBike";
import { YardCombobox } from "@/components/YardCombobox";

export default function Home() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <AreaSelector />
          <YardCombobox />
        </div>

        <canvas className="border-2 rounded-2xl w-full"></canvas>
      </div>

      <div className="col-span-1 flex flex-col items-center justify-baseline gap-4">
        <SearchBike />
      </div>
    </div>
  );
}
