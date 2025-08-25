import { useEffect, useState } from "react";

interface ProgressButtonProps {
  loading: boolean;
  progress?: number; // 0 a 100
  onClick: () => void;
}

export default function ProgressButton({ loading, progress = 0, onClick }: ProgressButtonProps) {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setInternalProgress(progress);
    } else if (internalProgress > 0) {
      // quando loading termina, manter a barra cheia por 3s
      setInternalProgress(100);
      const timer = setTimeout(() => setInternalProgress(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, progress]);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="relative w-full rounded overflow-hidden bg-gray-300 h-10 text-gray-950 font-medium"
    >
      {/* Barra de progresso preta */}
      {internalProgress > 0 && (
        <span
          className="absolute left-0 top-0 h-full bg-slate-400 transition-all duration-300"
          style={{ width: `${internalProgress}%` }}
        ></span>
      )}

      <span className="relative z-10 flex items-center justify-center h-full">
        {loading ? "Removing background..." : "Remove Background"}
      </span>
    </button>
  );
}
