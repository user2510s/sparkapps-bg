import { Download } from "lucide-react";

interface ResultDisplayProps {
  resultUrl: string;
  fileName: string;
}

export default function ResultDisplay({ resultUrl, fileName }: ResultDisplayProps) {
  return (
    <div className="space-y-2 w-full flex items-center justify-center border border-gray-200 p-5 rounded-2xl bg-zinc-700/30 backdrop:blur-3xl relative">
      <div className="flex flex-col justify-center w-full">
        <img src={resultUrl} alt="result" className="mx-auto max-h-[300px] w-auto object-contain" />
        <a
          href={resultUrl}
          download={`${fileName.replace(/\.[^/.]+$/, "")}.png`}
          className="flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-all"
        >
          <Download className="shrink-0 size-5" />
          Download Image
        </a>
      </div>
    </div>
  );
}
