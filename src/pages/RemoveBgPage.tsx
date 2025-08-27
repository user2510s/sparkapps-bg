import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import FileUpload from "../components/layout/FileUpload";
import ImagePreview from "../components/layout/ImagePreview";
import ResultDisplay from "../components/layout/ResultDisplay";
import { resizeImage } from "../utils/imageUtils";
import SplitText from "../components/ui/SplitText";
import ProgressButton from "../components/ui/ProgressButton";
//import Button from "../components/ui/Button";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/"))
      return setError("Please upload an image file (JPG, PNG)");
    if (selectedFile.size > 10 * 1024 * 1024)
      return setError("Image too large. Max 10MB.");

    setError(null);
    setFile(selectedFile);
    setResultUrl(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setError(null);
  };

  const handleRemoveBackground = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(0);

    // Simular progresso
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 95)); // vai até 95%
    }, 100);

    try {
      const resizedFile = await resizeImage(file);
      //const isSelfie = /selfie|face|portrait/i.test(file.name);
      const resultBlob = await removeBackground(resizedFile, {
        model: "isnet_fp16",
      });

      const img = await createImageBitmap(resultBlob);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.filter = "blur(0.2px) saturate(1.1)";
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4)
        if (data[i + 3] < 255) data[i + 3] = Math.round(data[i + 3] * 0.9);
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((processed) => {
        if (processed) setResultUrl(URL.createObjectURL(processed));
      });

      setProgress(100); // concluído
    } catch (err) {
      console.error(err);
      setError("Failed to remove background.");
      setProgress(0);
    } finally {
      clearInterval(interval);
      setLoading(false); // ProgressButton vai manter a barra cheia por 3s
    }
  };

  return (
    <div className="py-6 space-y-4">
      <SplitText
        text="Remove-background"
        className="text-2xl font-semibold text-center pl-5 text-slate-100 py-4"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={handleAnimationComplete}
      />
      {!file ? (
        <FileUpload
          onFileSelect={handleFileSelect}
          dragActive={dragActive}
          setDragActive={setDragActive}
        />
      ) : (
        <ImagePreview
          preview={preview!}
          fileName={file.name}
          fileSizeMB={file.size / (1024 * 1024)}
          onRemove={removeFile}
        />
      )}
      <div className="flex items-center w-full justify-center p-2">
        <p className="text-slate-300 font-extralight text-shadow-2xs">
          Processing happens on your device. For best results, use clear images
          under 10MB. Large images will be resized automatically.
        </p>
      </div>
      <ProgressButton
        loading={loading}
        progress={progress}
        onClick={handleRemoveBackground}
      />
      {resultUrl && (
        <ResultDisplay resultUrl={resultUrl} fileName={file!.name} />
      )}
      {error && <p className="text-red-500 pl-4">{error}</p>}
    </div>
  );
}
