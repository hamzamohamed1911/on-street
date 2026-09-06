"use client";

import { QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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

export function ScanQr() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<
    "denied" | "unsupported" | null
  >(null);

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    const videoEl = videoRef.current;
    const Detector = (
      window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }
    ).BarcodeDetector;

    if (!videoEl || !Detector) {
      const frameId = requestAnimationFrame(() => {
        setCameraError("unsupported");
        setIsScanning(false);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const video: HTMLVideoElement = videoEl;
    let cancelled = false;
    let stream: MediaStream | undefined;
    let frameId = 0;
    let lastInvalidValue = "";
    const detector = new Detector({ formats: ["qr_code"] });

    function stop() {
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }

    async function scan() {
      if (cancelled || video.readyState < 2) {
        frameId = requestAnimationFrame(() => {
          void scan();
        });
        return;
      }

      const codes = await detector.detect(video);
      const qrId = codes[0] ? parseQrId(codes[0].rawValue) : null;

      if (qrId) {
        stop();
        setIsScanning(false);
        router.push(`/${qrId}`);
        return;
      }

      if (codes[0] && !qrId && codes[0].rawValue !== lastInvalidValue) {
        lastInvalidValue = codes[0].rawValue;
        toast.error(t("scanInvalid"));
      }

      frameId = requestAnimationFrame(() => {
        void scan();
      });
    }

    void navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = mediaStream;
        video.srcObject = mediaStream;
        return video.play();
      })
      .then(() => {
        if (!cancelled) {
          void scan();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError("denied");
          setIsScanning(false);
        }
      });

    return () => {
      cancelled = true;
      stop();
    };
  }, [isScanning, router, t]);

  function closeScanner() {
    setIsScanning(false);
  }

  return (
    <div className="text-start">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
        <QrCode className="size-7" />
      </div>
      <h1 className="mt-4 text-xl font-extrabold text-foreground text-center">
        {t("scanTitle")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-center">
        {t("scanDescription")}
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-6 w-full"
        disabled={cameraError != null}
        onClick={() => {
          setCameraError(null);
          setIsScanning(true);
        }}
      >
        <QrCode className="size-4" />
        {t("scanButton")}
      </Button>

      {cameraError === "denied" ? (
        <p className="mt-3 text-xs leading-relaxed text-destructive text-center">
          {t("scanPermissionDenied")}
        </p>
      ) : null}

      {cameraError === "unsupported" ? (
        <p className="mt-3 text-xs leading-relaxed text-destructive text-center">
          {t("scanUnsupported")}
        </p>
      ) : null}

      {isScanning ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 text-white">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
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
