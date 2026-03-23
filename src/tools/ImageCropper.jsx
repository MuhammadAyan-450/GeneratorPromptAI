// pages/ImageCropper.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ArrowLeft, Upload, Download, Crop as CropIcon, RefreshCw, AlertCircle } from "lucide-react";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropper = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null); // null = free crop
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setCompletedCrop(null);
      setError(null);
    }
  };

  const onImageLoad = useCallback((e) => {
    if (aspectRatio) {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  }, [aspectRatio]);

  const handleAspectChange = (newAspect) => {
    setAspectRatio(newAspect);
    if (imgRef.current && newAspect) {
      const { naturalWidth: width, naturalHeight: height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    }
  };

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return null;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [completedCrop]);

  const handleDownload = () => {
    const cropped = getCroppedImg();
    if (!cropped) return;

    const link = document.createElement("a");
    link.download = `cropped-${Date.now()}.jpg`;
    link.href = cropped;
    link.click();
  };

  const reset = () => {
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(null);
    setError(null);
    setAspectRatio(null);
  };

  useEffect(() => {
    if (completedCrop && previewCanvasRef.current) {
      getCroppedImg(); // force preview update
    }
  }, [completedCrop, getCroppedImg]);

  return (
    <>
      <Helmet>
        <title>Image Cropper Online 2026 Custom Aspect Ratio & Size</title>
        <meta
          name="description"
          content="Crop images online for free with custom aspect ratios (1:1, 16:9, 4:3, Instagram, TikTok). Perfect for profile pics, posts, stories, thumbnails. No signup, 100% Free"
        />
        <meta
          name="keywords"
          content="image cropper online, crop photo free, custom aspect ratio crop, instagram crop tool, tiktok video crop, free image cropping 2026, profile picture cropper"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-cropper" />

        <meta property="og:title" content="Image Cropper – Free Online with Aspect Ratios" />
        <meta property="og:description" content="Crop photos precisely for social media, websites & more – no quality loss, private & fast." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Cropper – Custom Ratios 2026" />
        <meta name="twitter:description" content="Crop images for Instagram, TikTok, WhatsApp – easy & precise." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image Cropper",
            url: "https://generatorpromptai.com/tools/image-cropper",
            description: "Free online tool to crop images with custom aspect ratios and dimensions.",
            applicationCategory: "UtilityApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Image Cropper
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Crop photos with custom ratios • Instagram • TikTok • Free & Safe
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            {!imgSrc ? (
              <div
                className="p-12 md:p-20 border-2 border-dashed border-gray-300 hover:border-sky-400 hover:bg-sky-50/20 transition-all text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) onSelectFile({ target: { files: e.dataTransfer.files } });
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onSelectFile}
                  className="hidden"
                />
                <Upload size={48} className="mx-auto text-gray-500 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Drop image or click to upload
                </h2>
                <p className="text-gray-500">JPG, PNG, WebP supported</p>
              </div>
            ) : (
              <div className="p-6 md:p-10">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Crop Area */}
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                        <CropIcon size={20} /> Crop Area
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAspectChange(null)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition ${aspectRatio === null
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          Free
                        </button>
                        <button
                          onClick={() => handleAspectChange(1)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition ${aspectRatio === 1
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          1:1
                        </button>
                        <button
                          onClick={() => handleAspectChange(16 / 9)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition ${aspectRatio === 16 / 9
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          16:9
                        </button>
                        <button
                          onClick={() => handleAspectChange(4 / 3)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition ${aspectRatio === 4 / 3
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          4:3
                        </button>
                        <button
                          onClick={() => handleAspectChange(3 / 2)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition ${aspectRatio === 3 / 2
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          3:2
                        </button>
                      </div>
                    </div>

                    <div className="border rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        ruleOfThirds
                        aspect={aspectRatio}
                        minWidth={60}
                        minHeight={60}
                      >
                        <img
                          ref={imgRef}
                          src={imgSrc}
                          onLoad={onImageLoad}
                          alt="Image to crop – drag corners or move box"
                          className="w-full max-h-[500px] object-contain"
                        />
                      </ReactCrop>
                    </div>
                  </div>

                  {/* Preview & Download */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                      <Download size={20} /> Preview & Download
                    </h3>

                    <div className="border rounded-xl overflow-hidden bg-gray-50 shadow-sm min-h-[300px] flex items-center justify-center p-4">
                      {completedCrop ? (
                        <canvas
                          ref={previewCanvasRef}
                          className="max-w-full max-h-[500px] object-contain shadow-md"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <CropIcon size={48} className="mx-auto mb-4 opacity-40" />
                          <p>Adjust crop box to see preview</p>
                        </div>
                      )}
                    </div>

                    {completedCrop && (
                      <div className="text-sm text-gray-600 text-center">
                        Cropped: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleDownload}
                        disabled={!completedCrop}
                        className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Download size={18} />
                        Crop & Download
                      </button>

                      <button
                        onClick={reset}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={18} />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Online Image Cropper – Custom Aspect Ratios
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Crop​‍​‌‍​‍‌​‍​‌‍​‍‌ your images exactly with standard aspect ratios (1:1, 16:9, 4:3, free crop) – great for Instagram posts/stories, TikTok videos, profile pictures, YouTube thumbnails, or product photos. No need to download software, signup or register, everything remains in your ​‍​‌‍​‍‌​‍​‌‍​‍‌browser.              </p>
              <p>
                Image​‍​‌‍​‍‌​‍​‌‍​‍‌ Cropper - compatible with JPG, PNG, and WebP formats. Use the rule-of-thirds grid to improve your composition. It is speedy, private, and 100% secure for creators, businesses, and users all over the ​‍​‌‍​‍‌​‍​‌‍​‍‌world.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Image Cropper
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your image (JPG, PNG, WebP).</li>
                <li>Choose an aspect ratio (1:1 square, 16:9 video, 4:3 classic, or free).</li>
                <li>Drag corners or move the crop box to select the area you want.</li>
                <li>See real-time preview on the right side.</li>
                <li>Click <strong>Crop & Download</strong> to save the cropped image.</li>
                <li>Use <strong>Reset</strong> to start over with a new photo.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Image Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/image-compressor"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Compressor
                </h3>
                <p className="text-gray-600 text-sm">
                  Reduce file size without losing quality.
                </p>
              </Link>

              <Link
                to="/tools/image-resizer"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Resizer
                </h3>
                <p className="text-gray-600 text-sm">
                  Resize images to exact dimensions.
                </p>
              </Link>

              <Link
                to="/tools/image-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert between JPG, PNG, WebP formats.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ImageCropper;