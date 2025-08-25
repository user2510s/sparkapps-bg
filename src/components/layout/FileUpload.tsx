import { useRef, type ChangeEvent, type DragEvent } from "react";
import { Upload } from "lucide-react";
import Button from "../ui/Button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
}

export default function FileUpload({ onFileSelect, dragActive, setDragActive }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onFileSelect(selectedFile);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-1 border-dashed p-12 transition-colors w-full ${
        dragActive ? "border-blue-500 bg-slate-950/75" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="mb-4 h-10 w-10 text-gray-400" />
      <h3 className="mb-2 text-sm font-medium text-gray-300">
        Drag and drop your image here
      </h3>
      <p className="mb-4 text-sm text-gray-400">Supports: JPG, PNG, JPEG</p>
      <Button
        onClick={() => inputRef.current?.click()}
        variant="primary"
      >
        Browse Files
      </Button>
      <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
