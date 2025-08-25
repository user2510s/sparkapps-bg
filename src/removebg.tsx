import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Download, Loader2, Upload, X } from "lucide-react";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reduz e mantém qualidade da imagem antes de enviar ao modelo
  const resizeImage = (file: File, maxSize = 2048): Promise<File> =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target?.result as string);
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: file.type }));
          else resolve(file);
        }, file.type);
      };
      reader.readAsDataURL(file);
    });

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG)");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image too large. Max 10MB.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResultUrl(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

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
    if (droppedFile) handleFile(droppedFile);
  };

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
      const resizedFile = await resizeImage(file);

      // Detecta selfie/portrait para usar modelo adequado
      const isSelfie = /selfie|face|portrait/i.test(file.name);
      const resultBlob = await removeBackground(resizedFile, {
        model: isSelfie ? "isnet" : "isnet_fp16",
      });

      // Pós-processamento para suavizar borda e preservar transparência
      const img = await createImageBitmap(resultBlob);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.filter = "blur(1px) saturate(1.1)"; // suaviza bordas e realça cores
      ctx.drawImage(img, 0, 0);

      // Suavização alpha nas bordas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 255) data[i + 3] = Math.round(data[i + 3] * 0.9);
      }
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((processed) => {
        if (processed) setResultUrl(URL.createObjectURL(processed));
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to remove background. Try another image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-4">
      <h1 className="text-2xl font-light text-zinc-300 pl-4 pb-4">
        Background Remover
      </h1>

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
                className="py-2 px-4 font-extralight cursor-pointer text-gray-950 bg-gray-100 rounded text-sm"
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
                  className="absolute right-8 top-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-600"
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
            Processing happens on your device. For best results, use clear
            images under 10MB. Large images will be resized automatically.
          </p>

          <button
            onClick={handleRemoveBackground}
            disabled={!file || loading}
            className={`px-4 py-2 rounded w-full flex items-center justify-center gap-2 mt-6 ${
              file && !loading
                ? "text-gray-950 bg-gray-100 hover:bg-gray-800 transition-all cursor-pointer"
                : "text-gray-950 bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="size-5 shrink-0 animate-spin" />}
            {loading ? "Removing background..." : "Remove Background"}
          </button>
        </div>
      </div>

      {resultUrl && (
        <>
          <h2 className="text-2xl font-extralight text-slate-200 mt-6 pl-4">
            Result
          </h2>
          <div className="space-y-2 w-full flex items-center justify-center border border-gray-200 p-5 rounded-2xl bg-zinc-700/30 backdrop:blur-3xl relative">
            <div className="flex flex-col justify-center w-full">
              <img
                src={resultUrl}
                alt="result"
                className="mx-auto max-h-[300px] w-auto object-contain"
              />
              <a
                href={resultUrl}
                download="no-bg.png"
                className="flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-all"
              >
                <Download className="shrink-0 size-5" />
                Download Image
              </a>
            </div>
          </div>
        </>
      )}

      {error && <p className="text-red-500 pl-4">{error}</p>}
    </div>
  );
}
