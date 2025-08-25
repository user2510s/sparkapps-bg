import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Download, Loader2, Upload, X } from "lucide-react";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Unified file handling for both input and drag-and-drop
  const handleFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG)");
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file size: max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResultUrl(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.onerror = () => {
      setError("Failed to read image file");
      setPreview(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Drag-and-drop handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  // File input handler
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveBackground = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const resultBlob = await removeBackground(file);
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to remove background");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-4 ">
      <h1 className="text-2xl font-light text-zinc-300 pl-4 pb-4">Background Remover</h1>
      <div className="w-full flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm bg-zinc-700/30 backdrop:blur-3xl">
        <div className="p-6 w-full">
          {!file ? (
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors w-full ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
              <p className="mb-4 text-sm text-gray-400">
                Supports: JPG, PNG, JPEG
              </p>
              <button
                onClick={() => inputRef.current?.click()}
                className="py-2 px-4 font-extralight cursor-pointer text-white bg-gray-500 rounded text-sm"
              >
                Browse Files
              </button>
              <input
                ref={inputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="space-y-4 w-full flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm">
              <div className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center w-full">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-[300px] w-auto object-contain rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100">
                    <Loader2 className="h-16 w-16 text-gray-400 mb-2 animate-spin" />
                    <p className="text-sm text-gray-600">Loading preview...</p>
                  </div>
                )}
                <button
                  onClick={removeFile}
                  className="py-2 px-4 font-semibold text-white bg-gray-600 text-sm flex items-center justify-center absolute right-8 top-0 h-8 w-8 rounded-full size-6"
                >
                  <X className="h-4 w-4 text-white shrink-0" />
                </button>
              </div>
              <div className="flex items-center justify-around text-zinc-200 font-extralight">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-400 mt-4 text-sm">
            This tool removes backgrounds on your device. Processing time
            depends on your device’s performance—a faster device will remove
            backgrounds more quickly. For best results, use images under 5MB.
          </p>

          <button
            onClick={handleRemoveBackground}
            disabled={!file || loading}
            className={`px-4 py-2 rounded w-full flex items-center justify-center gap-2 mt-6 ${
              file && !loading
                ? "bg-gray-700 text-white hover:bg-gray-800 transition-all cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="size-5 shrink-0 animate-spin" />}
            {loading ? "Removing wait..." : "Remove Background"}
          </button>
        </div>
      </div>

      {resultUrl && <h2 className="text-2xl font-extralight text-slate-200 mt-6 pl-4">Result</h2>}
      {error && <p className="text-red-500 pl-4">{error}</p>}
      {resultUrl && (
        <div className="space-y-2 w-full flex items-center justify-center border border-gray-200 p-5 rounded-2xl  bg-zinc-700/30 backdrop:blur-3xl">
          <div className="flex flex-col justify-center w-full">
            <img
              src={resultUrl}
              alt="result"
              className="mx-auto max-h-[300px] w-auto object-contain"
            />
            <a
              href={resultUrl}
              download = "no-bg.png"
              className="flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-all"
            >
              <Download className="shrink-0 size-5" />
              Download Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
