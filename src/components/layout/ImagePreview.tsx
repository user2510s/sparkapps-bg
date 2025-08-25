import { X } from "lucide-react";
import Button from "../ui/Button";

interface ImagePreviewProps {
  preview: string;
  fileName: string;
  fileSizeMB: number;
  onRemove: () => void;
}

export default function ImagePreview({ preview, fileName, fileSizeMB, onRemove }: ImagePreviewProps) {
  return (
    <div className="space-y-4 w-full flex flex-col gap-6 rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center w-full">
        <img src={preview} alt="Preview" className="mx-auto max-h-[250px] w-auto object-contain rounded-2xl" />
        <Button onClick={onRemove} variant="exit">
          <X className="h-5 w-5 text-white shrink-0"/>
        </Button>
      </div>
      <div className="flex items-center justify-around text-zinc-200 font-extralight">
        <p className="text-sm font-medium">{fileName}</p>
        <p className="text-sm text-gray-500">{fileSizeMB.toFixed(2)} MB</p>
      </div>
    </div>
  );
}
