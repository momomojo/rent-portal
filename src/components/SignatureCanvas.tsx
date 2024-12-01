import { useRef, useEffect } from 'react';

interface SignatureCanvasProps {
  onChange: (signature: string) => void;
}

export default function SignatureCanvas({ onChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const draw = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
      onChange(canvas.toDataURL());
    };

    canvas.addEventListener('mousedown', (e) => {
      isDrawing.current = true;
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing.current = false);
    canvas.addEventListener('mouseout', () => isDrawing.current = false);

    return () => {
      canvas.removeEventListener('mousedown', () => {});
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', () => {});
      canvas.removeEventListener('mouseout', () => {});
    };
  }, [onChange]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="border border-gray-300 rounded-md w-full"
        />
      </div>
      <button
        onClick={clearSignature}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Clear Signature
      </button>
    </div>
  );
}