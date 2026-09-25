import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  ExternalLink,
  RotateCw,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react';

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

interface PdfViewerProps {
  fileData?: string;
  blobUrl?: string;
  title: string;
  onDownload?: () => void;
  onOpenNewTab?: () => void;
}

const PDFJS_SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export const PdfViewer: React.FC<PdfViewerProps> = ({
  fileData,
  blobUrl,
  title,
  onDownload,
  onOpenNewTab
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.15);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [rendering, setRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamically load PDF.js from CDN to avoid bundle conflicts
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const initPdfJs = async () => {
      try {
        if (!window.pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${PDFJS_SCRIPT_URL}"]`);
            if (existingScript) {
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', () => reject(new Error('Failed to load PDF engine')));
              if (window.pdfjsLib) resolve();
              return;
            }

            const script = document.createElement('script');
            script.src = PDFJS_SCRIPT_URL;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load PDF engine from CDN'));
            document.head.appendChild(script);
          });
        }

        if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        }

        // Prepare document data
        let loadingTask: any;
        if (fileData) {
          let base64 = fileData;
          if (fileData.startsWith('data:')) {
            const parts = fileData.split(';base64,');
            base64 = parts[1] || '';
          }
          let binaryString = '';
          try {
            binaryString = atob(base64);
          } catch {
            binaryString = '';
          }
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          loadingTask = window.pdfjsLib.getDocument({ data: bytes });
        } else if (blobUrl) {
          loadingTask = window.pdfjsLib.getDocument(blobUrl);
        } else {
          setError('No PDF document source provided.');
          setLoading(false);
          return;
        }

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setLoading(false);
        }
      } catch (err: any) {
        console.warn('PDF.js rendering fallback triggered:', err);
        if (!isCancelled) {
          setError(err.message || 'Browser prevented inline PDF rendering.');
          setLoading(false);
        }
      }
    };

    initPdfJs();

    return () => {
      isCancelled = true;
    };
  }, [fileData, blobUrl]);

  // Render current page to HTML5 Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;
    let isCancelled = false;
    setRendering(true);

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale, rotation });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
        if (!isCancelled) {
          setRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('PDF Page render notice:', err);
        }
        if (!isCancelled) {
          setRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, currentPage, scale, rotation]);

  const handleFitWidth = () => {
    if (containerRef.current && pdfDoc) {
      const containerWidth = containerRef.current.clientWidth - 48;
      pdfDoc.getPage(currentPage).then((page: any) => {
        const standardViewport = page.getViewport({ scale: 1.0 });
        const newScale = Math.max(0.6, Math.min(2.5, containerWidth / standardViewport.width));
        setScale(newScale);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-[#05160E] rounded-2xl border border-[#D4AF37]/30 overflow-hidden relative"
    >
      {/* PDF Controls Toolbar */}
      <div className="px-4 py-2 bg-[#0D2E1F] border-b border-[#D4AF37]/25 flex items-center justify-between flex-wrap gap-2 text-xs flex-shrink-0 z-10">
        {/* Page Navigation */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || loading || !!error}
            className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] disabled:opacity-40 border border-[#D4AF37]/20 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1 font-mono text-xs px-2 py-0.5 bg-[#061810] rounded border border-[#D4AF37]/25 text-[#FFFDF9]">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={currentPage}
              disabled={loading || !!error}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= numPages) {
                  setCurrentPage(val);
                }
              }}
              className="w-8 text-center bg-transparent text-[#F0D283] font-bold border-b border-[#D4AF37]/40 focus:outline-none"
            />
            <span className="text-[#8FBCA7]">of {numPages || 1}</span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages || loading || !!error}
            className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] disabled:opacity-40 border border-[#D4AF37]/20 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            disabled={loading || !!error}
            className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] disabled:opacity-40 border border-[#D4AF37]/20"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-xs text-[#8FBCA7] w-12 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
            disabled={loading || !!error}
            className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] disabled:opacity-40 border border-[#D4AF37]/20"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleFitWidth}
            disabled={loading || !!error}
            className="px-2 py-0.5 rounded bg-[#061810] text-[#8FBCA7] hover:text-[#FFFDF9] disabled:opacity-40 text-[11px] border border-[#D4AF37]/20"
            title="Fit to screen width"
          >
            Fit Width
          </button>

          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            disabled={loading || !!error}
            className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] disabled:opacity-40 border border-[#D4AF37]/20"
            title="Rotate Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center space-x-2">
          {onOpenNewTab && (
            <button
              type="button"
              onClick={onOpenNewTab}
              className="px-2.5 py-1 rounded bg-[#061810] text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#123E2A] border border-[#D4AF37]/20 flex items-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </button>
          )}

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="px-2.5 py-1 rounded bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-[#071F14]/70 min-h-[400px]">
        {loading ? (
          <div className="m-auto text-center space-y-3 p-8">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#8FBCA7]">Rendering PDF document pages...</p>
          </div>
        ) : error ? (
          <div className="m-auto text-center max-w-md p-6 bg-[#0B2519] border border-[#D4AF37]/30 rounded-2xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-[#F0D283]">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#FFFDF9]">{title}</h4>
              <p className="text-xs text-[#8FBCA7] mt-1">
                DepEd Official Means of Verification (PDF Document)
              </p>
            </div>
            <p className="text-xs text-[#E2F0EA] bg-[#061810] p-3 rounded-xl border border-[#D4AF37]/20">
              The sandboxed preview frame prevented inline canvas rendering. You can view the document directly in a clean browser window or download it.
            </p>
            <div className="pt-2 flex items-center justify-center space-x-3">
              {onOpenNewTab && (
                <button
                  type="button"
                  onClick={onOpenNewTab}
                  className="px-4 py-2 bg-[#123E2A] text-[#F0D283] hover:bg-[#185338] rounded-xl text-xs font-semibold border border-[#D4AF37]/30 flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full PDF</span>
                </button>
              )}
              {onDownload && (
                <button
                  type="button"
                  onClick={onDownload}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative inline-block transition-opacity duration-200">
            {rendering && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center rounded-lg z-10">
                <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-2xl border border-white/10 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};
