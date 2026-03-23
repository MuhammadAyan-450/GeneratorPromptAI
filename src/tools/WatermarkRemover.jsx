// pages/WatermarkRemover.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Download, Eraser, RefreshCw, Undo2, Redo2 } from "lucide-react";

const WatermarkRemover = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brushSize, setBrushSize] = useState(20);
  const [sensitivity, setSensitivity] = useState(35); // 10–80
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const MAX_UNDO = 5;

  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP)");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setProcessedImage(null);
    setUndoStack([]);
    setRedoStack([]);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      saveToUndo();
    };
  };

  const saveToUndo = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    setUndoStack(prev => [...prev.slice(-MAX_UNDO + 1), dataUrl]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length <= 1) return;
    const previous = undoStack[undoStack.length - 2];
    setRedoStack(prev => [undoStack[undoStack.length - 1], ...prev]);
    setUndoStack(prev => prev.slice(0, -1));

    const img = new Image();
    img.src = previous;
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(img, 0, 0);
      setProcessedImage(canvasRef.current.toDataURL("image/png"));
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack(prev => [...prev, next]);
    setRedoStack(prev => prev.slice(1));

    const img = new Image();
    img.src = next;
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(img, 0, 0);
      setProcessedImage(canvasRef.current.toDataURL("image/png"));
    };
  };

  const removeWatermark = () => {
    if (!originalImage) return;
    setLoading(true);
    setError(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Pass 1: aggressive removal of bright/low-saturation areas
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);

      if (brightness > 180 && saturation < sensitivity) {
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        const radius = Math.floor(brushSize / 4);
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const idx = i + (dy * canvas.width + dx) * 4;
            if (idx >= 0 && idx < data.length) {
              sumR += data[idx];
              sumG += data[idx + 1];
              sumB += data[idx + 2];
              count++;
            }
          }
        }
        if (count > 0) {
          data[i] = sumR / count;
          data[i + 1] = sumG / count;
          data[i + 2] = sumB / count;
        }
      }
    }

    // Pass 2: light smoothing
    ctx.putImageData(imageData, 0, 0);
    saveToUndo();
    setProcessedImage(canvas.toDataURL("image/png"));
    setLoading(false);
  };

  const downloadProcessed = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `watermark-removed-${Date.now()}.png`;
    link.click();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(z => Math.min(z + 0.1, 3));
    } else {
      setZoom(z => Math.max(z - 0.1, 0.5));
    }
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-16">
        {/* 1. Tool Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
         Free Watermark Remover – Remove Watermarks from Photos Instantly
        </h1>

        {/* 2. Tool Interface */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
          {!originalImage ? (
            <div
              className="p-12 md:p-20 border-2 border-dashed border-gray-300 hover:border-sky-400 transition text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleImageUpload(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="hidden"
              />
              <Upload size={48} className="mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold mb-3">Upload Image with Watermark</h2>
              <p className="text-gray-500">Best for light text/logos on uniform backgrounds</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Original + Canvas Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eraser size={20} /> Original Image
                </h3>

                <div
                  ref={containerRef}
                  className="relative border rounded-xl overflow-hidden bg-gray-50 cursor-move"
                  style={{ height: "500px" }}
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas
                    ref={canvasRef}
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: "0 0",
                    }}
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">
                      Brush Sensitivity: {sensitivity}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={sensitivity}
                      onChange={(e) => setSensitivity(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">
                      Brush Size: {brushSize}px
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={removeWatermark}
                    disabled={loading}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Eraser size={18} />
                        Remove Watermark
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={undo}
                      disabled={undoStack.length <= 1}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50"
                      title="Undo"
                    >
                      <Undo2 size={18} />
                    </button>
                    <button
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50"
                      title="Redo"
                    >
                      <Redo2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setProcessedImage(null);
                        setUndoStack([]);
                        setRedoStack([]);
                      }}
                      className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
                    >
                      New Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Processed Result */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Download size={20} /> Processed Image
                </h3>

                {processedImage ? (
                  <>
                    <div className="border rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={processedImage}
                        alt="Watermark removed result"
                        className="w-full max-h-[500px] object-contain mx-auto"
                      />
                    </div>

                    <button
                      onClick={downloadProcessed}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Clean Image
                    </button>
                  </>
                ) : (
                  <div className="border rounded-xl bg-gray-50 h-[500px] flex items-center justify-center text-gray-500">
                    Click "Remove Watermark" to process
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="text-red-600 text-center mt-6 px-6">{error}</p>}
        </div>

        {/* 3. Description */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Free Online Watermark Remover – Remove Logos & Text from Photos Instantly
          </h2>
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              Remove watermarks, logos, text, timestamps, or unwanted objects from images quickly with our free online watermark remover. Best for cleaning up product photos, screenshots, memes, stock images, or personal pictures. Works directly in your browser – no upload to servers, no signup, no software download. Adjustable sensitivity and brush size give you control for better results on light-colored watermarks over uniform backgrounds.
            </p>
            <p>
              Built in Karachi, Pakistan – perfect for Pakistani photographers, e-commerce sellers, content creators, and social media users. Fast, private, and 100% secure. For very complex watermarks, professional AI tools may give even better results.
            </p>
          </div>
        </section>

        {/* 4. How to Use */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            How to Use the Watermark Remover
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>Click inside the upload area or drag & drop your image file (JPG, PNG, WebP recommended).</li>
              <li>Adjust <strong>Sensitivity</strong> slider (lower = removes more pixels, higher = more precise).</li>
              <li>Adjust <strong>Brush Size</strong> if needed (larger brush for bigger watermarks).</li>
              <li>Click <strong>Remove Watermark</strong> – the tool processes the image automatically.</li>
              <li>Use <strong>Undo</strong> / <strong>Redo</strong> buttons if the result is not perfect (up to 5 steps).</li>
              <li>Preview the cleaned image on the right.</li>
              <li>Click <strong>Download Clean Image</strong> to save the watermark-free version.</li>
              <li>Click <strong>New Image</strong> to start over.</li>
              <li>Tip: Best results on light text/logos over uniform backgrounds. For dark/complex watermarks, try multiple passes or professional tools.</li>
            </ol>
          </div>
        </section>

        {/* 5. Related Tools */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Related Free Online Image Tools
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/tools/image-compressor"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                Image Compressor
              </h3>
              <p className="text-gray-600 text-sm">
                Reduce image size without noticeable quality loss.
              </p>
            </Link>

            <Link
              to="/tools/image-cropper"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                Image Cropper
              </h3>
              <p className="text-gray-600 text-sm">
                Crop photos with custom aspect ratios easily.
              </p>
            </Link>

            <Link
              to="/tools/image-converter"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                Image Converter
              </h3>
              <p className="text-gray-600 text-sm">
                Convert between JPG, PNG, WebP, and other formats.
              </p>
            </Link>

            <Link
              to="/tools/image-resizer"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                Image Resizer
              </h3>
              <p className="text-gray-600 text-sm">
                Resize images to any dimension while keeping quality.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WatermarkRemover;