import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, RotateCcw, Trash2, Check, Sparkles } from 'lucide-react';

interface DrawingCanvasProps {
  initialData?: string;
  onSave: (imageData: string) => void;
  width?: number;
  height?: number;
  title?: string;
}

const COLORS = [
  '#000000', // 검정
  '#dc2626', // 빨강
  '#ea580c', // 주황
  '#ca8a04', // 노랑
  '#16a34a', // 초록
  '#0284c7', // 하늘
  '#2563eb', // 파랑
  '#9333ea', // 보라
  '#db2777', // 핑크
  '#78350f', // 갈색
  '#64748b', // 회색
  '#ffffff', // 흰색
];

const BRUSH_SIZES = [2, 4, 8, 14, 22];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialData,
  onSave,
  width = 640,
  height = 360,
  title = '독서 감상화 그리기'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background by default
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveState();
      };
      img.src = initialData;
    } else {
      saveState();
    }
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(0, historyStep + 1), imageData]);
    setHistoryStep((prev) => prev + 1);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
    exportCanvas();
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevStep = historyStep - 1;
    ctx.putImageData(history[prevStep], 0, 0);
    setHistoryStep(prevStep);
    exportCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    exportCanvas();
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div id="drawing-canvas-container" className="bg-amber-50/50 p-4 rounded-2xl border-2 border-amber-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-stone-800 text-sm">{title}</span>
          <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            마우스나 손가락으로 자유롭게 그려보세요!
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={historyStep <= 0}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-40 transition-colors"
            title="실행 취소"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>되돌리기</span>
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            title="전체 지우기"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>지우기</span>
          </button>
        </div>
      </div>

      {/* Palette & Tools Toolbar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm mb-3">
        {/* Colors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                !isEraser && color === c
                  ? 'scale-125 border-stone-800 shadow-md ring-2 ring-amber-400'
                  : 'border-stone-200 hover:scale-110'
              }`}
              title={c}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-stone-200 hidden sm:block" />

        {/* Eraser */}
        <button
          type="button"
          onClick={() => setIsEraser(!isEraser)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            isEraser
              ? 'bg-amber-500 text-white border-amber-600 shadow-inner'
              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
          }`}
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>지우개</span>
        </button>

        <div className="h-5 w-px bg-stone-200 hidden sm:block" />

        {/* Brush Sizes */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">굵기:</span>
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setBrushSize(size)}
              className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all ${
                brushSize === size
                  ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span
                className="rounded-full bg-stone-800"
                style={{ width: Math.max(3, size / 1.5), height: Math.max(3, size / 1.5) }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full overflow-hidden rounded-xl border-2 border-stone-300 bg-white shadow-inner flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto max-h-[380px] touch-none cursor-crosshair object-contain bg-white"
        />
      </div>
    </div>
  );
};
