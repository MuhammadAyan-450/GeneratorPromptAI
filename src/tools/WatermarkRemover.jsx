// pages/WatermarkRemover.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Upload, Download, Eraser, RefreshCw, Undo2, Redo2,
  Home, ChevronDown, Paintbrush, Scan, Layers, Maximize2
} from "lucide-react";

// ─── Inpainting Algorithm ────────────────────────────────────────────────────────
function detectWatermark(data, w, h, sensitivity) {
  const mask = new Uint8Array(w * h);
  const thresh = 200 - sensitivity;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    const brightness = (r + g + b) / 3;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    if ((brightness > thresh && saturation < sensitivity) || (a > 0 && a < 180)) {
      mask[i / 4] = 1;
    }
  }
  return mask;
}

function inpaint(data, mask, w, h, radius) {
  const out = new Uint8ClampedArray(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pi = y * w + x;
      if (!mask[pi]) continue;
      let sR = 0, sG = 0, sB = 0, tw = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const ni = ny * w + nx;
          if (mask[ni]) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;
          const weight = 1 / (dist + 0.5);
          const ci = ni * 4;
          sR += data[ci] * weight; sG += data[ci + 1] * weight; sB += data[ci + 2] * weight;
          tw += weight;
        }
      }
      if (tw > 0) {
        const ci = pi * 4;
        out[ci] = Math.round(sR / tw); out[ci + 1] = Math.round(sG / tw);
        out[ci + 2] = Math.round(sB / tw); out[ci + 3] = data[ci + 3];
      }
    }
  }
  for (let pass = 0; pass < 3; pass++) {
    const tmp = new Uint8ClampedArray(out);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const pi = y * w + x;
        if (!mask[pi]) continue;
        const ci = pi * 4;
        for (let c = 0; c < 3; c++) {
          out[ci + c] = Math.round((tmp[ci + c] * 4 + tmp[ci - 4 + c] + tmp[ci + 4 + c] +
            tmp[(ci - w * 4) + c] + tmp[(ci + w * 4) + c]) / 8);
        }
      }
    }
  }
  return out;
}

function paintCircle(mask, w, h, cx, cy, r) {
  const ri = Math.round(r);
  for (let dy = -ri; dy <= ri; dy++) {
    for (let dx = -ri; dx <= ri; dx++) {
      if (dx * dx + dy * dy > ri * ri) continue;
      const px = Math.round(cx + dx), py = Math.round(cy + dy);
      if (px >= 0 && px < w && py >= 0 && py < h) mask[py * w + px] = 1;
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const WatermarkRemover = () => {
  const [originalImg, setOriginalImg] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [showBefore, setShowBefore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [maskedPixels, setMaskedPixels] = useState(0);

  const [mode, setMode] = useState("auto");
  const [sensitivity, setSensitivity] = useState(35);
  const [brushSize, setBrushSize] = useState(25);
  const [repairRadius, setRepairRadius] = useState(5);

  const [maskData, setMaskData] = useState(null);
  const [isPainting, setIsPainting] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const containerRef = useRef(null);
  const MAX_UNDO = 5;
  const MAX_DIM = 2000;

  // ── Image Upload ─────────────────────────────────────────────────────────────
  const handleUpload = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP)");
      return;
    }
    setError(null);
    setProcessedImage(null);
    setShowBefore(false);
    setUndoStack([]); setRedoStack([]);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        const s = MAX_DIM / Math.max(w, h);
        w = Math.round(w * s); h = Math.round(h * s);
      }
      const canvas = canvasRef.current;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      setOriginalImg(img);
      setOriginalData(ctx.getImageData(0, 0, w, h));
      setMaskData(new Uint8Array(w * h));
      setImgW(w); setImgH(h);
      setZoom(1); setPan({ x: 0, y: 0 });
    };
  }, []);

  // ── Canvas Rendering ──────────────────────────────────────────────────────────
  const renderCanvas = useCallback(() => {
    if (!originalImg) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
    if (mode === "brush" && maskData) {
      const overlay = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < maskData.length; i++) {
        if (maskData[i]) {
          const ci = i * 4;
          overlay.data[ci] = 255; overlay.data[ci + 1] = 60;
          overlay.data[ci + 2] = 60; overlay.data[ci + 3] = 110;
        }
      }
      ctx.putImageData(overlay, 0, 0);
    }
  }, [originalImg, mode, maskData]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  // ── Mask Helpers ─────────────────────────────────────────────────────────────
  const saveMaskUndo = () => {
    if (!maskData) return;
    setUndoStack(p => [...p.slice(-MAX_UNDO + 1), new Uint8Array(maskData)]);
    setRedoStack([]);
  };
  const undo = () => {
    if (undoStack.length <= 1) return;
    setRedoStack(p => [undoStack[undoStack.length - 1], ...p]);
    setUndoStack(p => p.slice(0, -1));
    setMaskData(new Uint8Array(undoStack[undoStack.length - 2]));
  };
  const redo = () => {
    if (redoStack.length === 0) return;
    setUndoStack(p => [...p, redoStack[0]]);
    setRedoStack(p => p.slice(1));
    setMaskData(new Uint8Array(redoStack[0]));
  };

  // ── Coordinate Conversion ────────────────────────────────────────────────────
  const getImgCoords = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  // ── Brush Painting ─────────────────────────────────────────────────────────────
  const paintAt = (cx, cy) => {
    if (!maskData) return;
    paintCircle(maskData, imgW, imgH, cx, cy, brushSize);
    renderCanvas();
  };

  // ── Process Image ─────────────────────────────────────────────────────────────
  const processImage = async () => {
    if (!originalData) return;
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 60));

    let mask;
    if (mode === "auto") {
      mask = detectWatermark(originalData.data, imgW, imgH, sensitivity);
    } else {
      mask = maskData;
    }

    const count = mask.reduce((s, v) => s + v, 0);
    if (count === 0) {
      setError(mode === "auto"
        ? "No watermark detected. Try lowering the sensitivity or switch to Brush mode."
        : "No area painted. Use the brush to mark the watermark first.");
      setLoading(false); return;
    }

    const result = inpaint(originalData.data, mask, imgW, imgH, repairRadius);
    const offscreen = document.createElement("canvas");
    offscreen.width = imgW; offscreen.height = imgH;
    offscreen.getContext("2d").putImageData(new ImageData(result, imgW, imgH), 0, 0);
    setProcessedImage(offscreen.toDataURL("image/png"));
    setMaskedPixels(count);
    setLoading(false);
  };

  // ── Zoom & Pan ────────────────────────────────────────────────────────────────
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.min(Math.max(z + (e.deltaY < 0 ? 0.15 : -0.15), 4), 0.3));
  };
  const handlePanStart = (e) => {
    if (mode === "brush" && e.button === 0) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePanMove = (e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };
  const handlePanEnd = () => setIsPanning(false);

  // ── Brush Events (mouse) ──────────────────────────────────────────────────────
  const handleBrushDown = (e) => {
    if (mode !== "brush" || e.button !== 0) { handlePanStart(e); return; }
    setIsPainting(true);
    saveMaskUndo();
    const c = getImgCoords(e.clientX, e.clientY);
    paintAt(c.x, c.y);
  };
  const handleBrushMove = (e) => {
    if (mode !== "brush") { handlePanMove(e); return; }
    if (!isPainting) return;
    const c = getImgCoords(e.clientX, e.clientY);
    paintAt(c.x, c.y);
  };
  const handleBrushUp = () => { setIsPainting(false); setIsPanning(false); };

  // ── Brush Events (touch) ────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    if (mode !== "brush" || e.touches.length !== 1) return;
    e.preventDefault();
    setIsPainting(true);
    saveMaskUndo();
    const c = getImgCoords(e.touches[0].clientX, e.touches[0].clientY);
    paintAt(c.x, c.y);
  };
  const handleTouchMove = (e) => {
    if (mode !== "brush" || !isPainting) return;
    e.preventDefault();
    const c = getImgCoords(e.touches[0].clientX, e.touches[0].clientY);
    paintAt(c.x, c.y);
  };
  const handleTouchEnd = () => setIsPainting(false);

  // ── Download ──────────────────────────────────────────────────────────────────
  const downloadResult = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `watermark-removed-${Date.now()}.png`;
    link.click();
  };
  const resetAll = () => {
    setOriginalImg(null); setOriginalData(null); setProcessedImage(null);
    setMaskData(null); setUndoStack([]); setRedoStack([]);
    setError(null); setShowBefore(false); setMaskedPixels(0);
    setZoom(1); setPan({ x: 0, y: 0 });
  };

  // ── Schemas ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Remove Watermark from Photo Online Free – Inpainting Tool No Signup",
    "url": "https://www.generatorpromptai.com/tools/watermark-remover",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "description": "Free online watermark remover with inpainting algorithm. Auto-detect light watermarks or manually brush over any watermark area. Processes images in your browser — no upload to servers. No signup.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };
  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Watermark Remover", "item": "https://www.generatorpromptai.com/tools/watermark-remover" }
    ]
  };
  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How to remove watermark from photo online free?", "acceptedAnswer": { "@type": "Answer", "text": "Upload your image, choose Auto mode and click Remove Watermark. The tool detects light-colored watermarks and fills them using a neighbor-sampling inpainting algorithm. Or switch to Brush mode and paint over the watermark area manually for more control." } },
      { "@type": "Question", "name": "Is this watermark remover safe and private?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All image processing happens entirely in your browser using the Canvas API. Your images are never uploaded to any server. 100% private." } },
      { "@type": "Question", "name:": "What is the difference between Auto and Brush mode?", "acceptedAnswer": { "@type": "Answer", "text": "Auto mode automatically detects light-colored, low-saturation areas (typical text/logo watermarks) and removes them. Brush mode lets you manually paint over any watermark — works on any color or pattern." } },
      { "@type": "Question", "name": "What does Repair Radius do?", "acceptedAnswer": { "@type": "Answer", "text": "Repair Radius controls how far the algorithm looks for replacement pixels when filling a masked area. A larger radius produces smoother results on uniform backgrounds. A smaller radius preserves more detail but may show artifacts." } },
      { "@type": "Question", "name": "Can I remove dark or complex watermarks?", "acceptedAnswer": { "@type": "Answer", "text": "Use Brush mode to manually mark the watermark area regardless of color. The inpainting algorithm fills the area with surrounding pixels. For best results, the area around the watermark should have a relatively uniform texture." } }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Remove Watermark from Photo Online Free – Inpainting Tool No Signup</title>
        <meta name="description" content="Free online watermark remover with inpainting algorithm. Auto-detect light watermarks or manually brush over any area. Processes in browser — no server upload. No signup." />
        <meta name="keywords" content="how to remove watermark from photo online free, remove watermark from image without losing quality free tool, free online watermark remover with inpainting algorithm, brush tool to remove watermark from any image free, remove logo text timestamp from photo online free, best free watermark remover no signup no upload, remove semi transparent watermark from png jpg free, inpaint tool remove object from photo online free, watermark remover for ecommerce product photos free, free browser based watermark removal tool 2026" />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/watermark-remover" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Remove Watermark from Photo Free – Inpainting Tool | No Signup" />
        <meta property="og:description" content="Auto-detect or brush over watermarks. Inpainting fills the area. 100% browser-based, no upload." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/watermark-remover" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Watermark Remover – Inpainting Tool | No Server Upload" />
        <meta name="twitter:description" content="Remove watermarks with auto-detect or manual brush. Inpainting fills areas. Free, private." />
        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link to="/" className="inline-flex items-center gap-1.5 hover:text-sky-600 transition-colors"><Home size={14} /> Home</Link></li>
              <li><span className="text-gray-300">/</span></li>
              <li><Link to="/pages/all-tools" className="hover:text-sky-600 transition-colors">All Tools</Link></li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">Watermark Remover</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">
          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Eraser className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Remove Watermark from Photo Online Free –{" "}
              <span className="text-sky-600">Inpainting Tool No Signup</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Auto-detect light watermarks or brush over any area. Neighbor-sampling inpainting fills the area seamlessly. 100% browser-based.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} className="hidden" />

            {!originalImg ? (
              <div
                className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-sky-400 transition-colors"
                onClick={() => fileRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); }}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Click or drag an image to <strong className="text-gray-500">upload</strong></p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max {MAX_DIM}px auto-scaled</p>
              </div>
            ) : (
              <>
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-5">
                  <button onClick={() => setMode("auto")} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === "auto" ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"}`}>
                    <Scan size={16} /> Auto Detect
                  </button>
                  <button onClick={() => setMode("brush")} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === "brush" ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"}`}>
                    <Paintbrush size={16} /> Manual Brush
                  </button>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  {mode === "auto" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sensitivity: {sensitivity}</label>
                      <input type="range" min="10" max="80" value={sensitivity} onChange={(e) => setSensitivity(+e.target.value)} className="w-full accent-sky-600" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1"><span>More</span><span>Less</span></div>
                    </div>
                  )}
                  {mode === "brush" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Brush Size: {brushSize}px</label>
                      <input type="range" min="5" max="80" value={brushSize} onChange={(e) => setBrushSize(+e.target.value)} className="w-full accent-sky-600" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Small</span><span>Large</span></div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Repair Radius: {repairRadius}</label>
                    <input type="range" min="2" max="15" value={repairRadius} onChange={(e) => setRepairRadius(+e.target.value)} className="w-full accent-sky-600" />
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Sharp</span><span>Smooth</span></div>
                  </div>
                  <div className="flex items-end gap-2">
                    <button onClick={undo} disabled={undoStack.length <= 1} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-1">
                      <Undo2 size={14} /> Undo
                    </button>
                    <button onClick={redo} disabled={redoStack.length === 0} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-1">
                      <Redo2 size={14} /> Redo
                    </button>
                  </div>
                  <button onClick={resetAll} className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors">
                    New Image
                  </button>
                </div>

                {mode === "brush" && (
                  <p className="text-xs text-sky-600 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 mb-4">
                    🖌️ <strong>Brush mode active</strong> — Paint over the watermark area on the image below. Scroll to zoom, hold Shift+drag to pan.
                  </p>
                )}

                {/* Canvas */}
                <div
                  ref={containerRef}
                  className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-100 cursor-move mb-4"
                  style={{ height: "420px", touchAction: "none" }}
                  onWheel={handleWheel}
                  onMouseDown={handleBrushDown}
                  onMouseMove={handleBrushMove}
                  onMouseUp={handleBrushUp}
                  onMouseLeave={handleBrushUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <canvas
                    ref={canvasRef}
                    style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
                    className={mode === "brush" ? "cursor-crosshair" : ""}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <Maximize2 size={12} /> {Math.round(zoom * 100)}%
                  </div>
                </div>

                {/* Image Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Width</p>
                    <p className="text-sm font-bold text-gray-800">{imgW}px</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Height</p>
                    <p className="text-sm font-bold text-gray-800">{imgH}px</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Mode</p>
                    <p className="text-sm font-bold text-sky-600 capitalize">{mode}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Pixels Marked</p>
                    <p className="text-sm font-bold text-gray-800">{maskedPixels.toLocaleString()}</p>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={processImage}
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 transition-all text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  {loading ? <><RefreshCw size={18} className="animate-spin" /> Processing…</> : <><Eraser size={18} /> Remove Watermark</>}
                </button>

                {error && <p className="text-red-500 text-sm text-center mt-3 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>}

                {/* Result */}
                {processedImage && (
                  <div className="mt-6">
                    <div className="bg-gray-900 rounded-2xl p-5 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Result Preview</p>
                        <button onClick={() => setShowBefore(!showBefore)} className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors">
                          {showBefore ? "▶ Show Result" : "▶ Show Original"}
                        </button>
                      </div>
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={showBefore ? canvasRef.current.toDataURL() : processedImage}
                          alt="Preview"
                          className="w-full max-h-[350px] object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {showBefore ? "Showing original image" : `Inpainted result — ${maskedPixels.toLocaleString()} pixels repaired`}
                      </p>
                    </div>
                    <div className="flex justify-center gap-3">
                      <button onClick={downloadResult} className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors">
                        <Download size={15} /> Download PNG
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Online Watermark Remover — Inpainting Algorithm, No Server Upload</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our watermark remover uses a <strong>neighbor-sampling inpainting algorithm</strong> that fills watermark areas with surrounding pixel data instead of just deleting pixels. When a watermark pixel is detected (or manually brushed), the algorithm searches nearby non-watermark pixels within the repair radius, weights them by inverse distance, and replaces the watermark pixel with a weighted average. Three smoothing passes then blend the filled area seamlessly into the surrounding image.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This produces <strong>significantly better results</strong> than simple pixel removal tools. All processing happens <strong>100% in your browser</strong> using the Canvas API — your images are never uploaded to any server, making it completely private and secure.
            </p>
          </div>

          {/* How to Use */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Remove Watermark from Photo Online Free</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Upload your image</strong> — click or drag-and-drop a JPG, PNG, or WebP file.</li>
              <li><strong>Choose Auto Detect mode</strong> for light text/logo watermarks, or <strong>Manual Brush mode</strong> for any color watermark.</li>
              <li>In Brush mode, <strong>paint over the watermark area</strong> directly on the image (red overlay shows where you painted).</li>
              <li>Adjust <strong>Sensitivity</strong> (auto mode), <strong>Brush Size</strong> (brush mode), and <strong>Repair Radius</strong> (smoothing level).</li>
              <li>Click <strong>"Remove Watermark"</strong> — the inpainting algorithm processes the image.</li>
              <li>Toggle <strong>"Show Original"</strong> to compare before/after, then <strong>Download PNG</strong>.</li>
            </ol>
          </div>

          {/* Features Grid */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Watermark Inpainting Tool — Key Features</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Neighbor-Sampling Inpainting", desc: "Unlike tools that just delete watermark pixels (leaving holes), our algorithm fills removed areas by sampling surrounding non-watermark pixels weighted by inverse distance. Three smoothing passes blend the result seamlessly." },
                { title: "Auto Detect + Manual Brush", desc: "Auto mode detects light, low-saturation areas typical of text watermarks. Brush mode lets you manually paint over any watermark regardless of color — works on dark logos, patterns, and semi-transparent overlays." },
                { title: "Adjustable Repair Radius", desc: "Control how far the algorithm reaches for replacement pixels. Small radius preserves fine detail (good for text near edges). Large radius produces smoother results on uniform backgrounds (good for large logos)." },
                { title: "100% Browser-Based & Private", desc: "All processing uses the Canvas API in your browser. Images are never uploaded to any server. Zoom and pan for precision. Undo/redo up to 5 steps in brush mode." }
              ].map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Watermark Remover – Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                { q: "How to remove watermark from photo online free?", a: "Upload your image, choose Auto Detect mode for light watermarks or Brush mode for any color. Click Remove Watermark. The inpainting algorithm fills the area with surrounding pixels. Download the result." },
                { q: "Is this watermark remover safe and private?", a: "Yes. All processing happens in your browser using the Canvas API. Your images are never uploaded to any server. 100% private and secure." },
                { q: "What is the difference between Auto and Brush mode?", a: "Auto mode automatically detects light-colored, low-saturation areas (typical text/logo watermarks). Brush mode lets you manually paint over any watermark regardless of color — works on dark logos, patterns, and semi-transparent overlays." },
                { q: "What does Repair Radius do?", a: "Repair Radius controls how far the algorithm searches for replacement pixels. A larger radius produces smoother results on uniform backgrounds. A smaller radius preserves more detail but may show artifacts near complex edges." },
                { q: "Can I remove dark or complex watermarks?", a: "Yes — use Brush mode to manually mark the watermark area regardless of its color. The inpainting fills it with surrounding pixels. For best results, the area around the watermark should have relatively uniform texture." }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Image Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Reduce image file size without noticeable quality loss." },
                { to: "/tools/image-cropper", title: "Image Cropper", desc: "Crop photos with custom aspect ratios easily." },
                { to: "/tools/image-converter", title: "Image Converter", desc: "Convert between JPG, PNG, WebP, and other formats." }
              ].map((t) => (
                <Link key={t.to} to={t.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">{t.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default WatermarkRemover;