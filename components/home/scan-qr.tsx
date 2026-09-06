"use client";

import jsQR from "jsqr";
import { QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { parseQrId } from "@/lib/qr";

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
};

type BarcodeDetectorCtor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorInstance;

function getBarcodeDetector() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }
  ).BarcodeDetector ?? null;
}

async function getCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("Camera is not available", "NotSupportedError");
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
  } catch {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  }
}

async function readQrValue(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  detector: BarcodeDetectorInstance | null,
) {
  if (detector) {
    const codes = await detector.detect(video);

    if (codes[0]?.rawValue) {
      return codes[0].rawValue;
    }
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    return null;
  }

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  context.drawImage(video, 0, 0, width, height);
  const image = context.getImageData(0, 0, width, height);

  return (
    jsQR(image.data, width, height, { inversionAttempts: "attemptBoth" })?.data ??
    null
  );
}

export function ScanQr() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<
    "denied" | "unsupported" | null
  >(null);

  useEffect(() => {
    if (!isScanning || !video) {
      return;
    }

    const preview: HTMLVideoElement = video;
    const Detector = getBarcodeDetector();
    const detector = Detector ? new Detector({ formats: ["qr_code"] }) : null;
    const canvas = document.createElement("canvas");
    let cancelled = false;
    let stream: MediaStream | undefined;
    let frameId = 0;
    let lastInvalidValue = "";

    function stop() {
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      preview.srcObject = null;
    }

    async function scan() {
      if (cancelled || preview.readyState < 2) {
        frameId = requestAnimationFrame(() => {
          void scan();
        });
        return;
      }

      const rawValue = await readQrValue(preview, canvas, detector);
      const qrId = rawValue ? parseQrId(rawValue) : null;

      if (qrId) {
        stop();
        setIsScanning(false);
        router.push(`/${qrId}`);
        return;
      }

      if (rawValue && !qrId && rawValue !== lastInvalidValue) {
        lastInvalidValue = rawValue;
        toast.error(t("scanInvalid"));
      }

      frameId = requestAnimationFrame(() => {
        void scan();
      });
    }

    void getCameraStream()
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = mediaStream;
        preview.srcObject = mediaStream;
        return preview.play();
      })
      .then(() => {
        if (!cancelled) {
          void scan();
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const name = error instanceof DOMException ? error.name : "";
        setCameraError(name === "NotSupportedError" ? "unsupported" : "denied");
        setIsScanning(false);
      });

    return () => {
      cancelled = true;
      stop();
    };
  }, [isScanning, router, t, video]);

  function closeScanner() {
    setIsScanning(false);
  }

  return (
    <div className="text-start">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
        <QrCode className="size-7" />
      </div>
      <h1 className="mt-4 text-center text-xl font-extrabold text-foreground">
        {t("scanTitle")}
      </h1>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
        {t("scanDescription")}
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-6 w-full"
        disabled={isScanning}
        onClick={() => {
          setCameraError(null);
          setIsScanning(true);
        }}
      >
        <QrCode className="size-4" />
        {t("scanButton")}
      </Button>

      {cameraError === "denied" ? (
        <p className="mt-3 text-center text-xs leading-relaxed text-destructive">
          {t("scanPermissionDenied")}
        </p>
      ) : null}

      {cameraError === "unsupported" ? (
        <p className="mt-3 text-center text-xs leading-relaxed text-destructive">
          {t("scanUnsupported")}
        </p>
      ) : null}

      {isScanning ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 text-white">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <video
                ref={setVideo}
                className="aspect-square w-full object-cover"
                playsInline
                muted
                autoPlay
              />
              <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-white/80" />
            </div>
            <p className="mt-4 text-center text-sm text-white/80">
              {t("scanHint")}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-auto"
              onClick={closeScanner}
            >
              {t("scanCancel")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
