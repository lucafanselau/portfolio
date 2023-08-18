import { useStore } from "@3d/store";
import { isNone, isSome, range } from "@components/utils";
import { IconCamera, IconDownload, IconShare } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { LoadingSpinner } from "@ui/loader";
import { cn } from "@ui/utils";
import { FC, useCallback, useState, useTransition } from "react";

const screenshot = (): Promise<File | undefined> => {
  const three = useStore.getState().getThree?.();
  return new Promise((r) => {
    if (isNone(three)) return r(undefined);
    three.gl.domElement.toBlob((blob) => {
      if (isNone(blob)) return;

      const file = new File([blob], "screenshot.png", { type: blob.type });
      r(file);
    });
  });
};

const share = (file: File) => {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    void navigator.share({
      files: [file],
      title: "Screenshot",
    });
  }
};

const download = (file: File) => {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};

const ShareButtons = ({
  className,
  file,
}: {
  className: string;
  file: { file: File; url: string } | undefined;
}) => {
  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <Button
        variant="inverted"
        size={"sm"}
        className={"flex-1"}
        onClick={() => isSome(file) && share(file.file)}
      >
        <IconShare className={"mr-4"} />
        Share
      </Button>
      <Button
        variant="inverted"
        className={"flex-1"}
        size={"sm"}
        onClick={() => isSome(file) && download(file.file)}
      >
        <IconDownload className={"mr-4"} />
        Download
      </Button>
    </div>
  );
};

export const ScreenshotModal: FC = () => {
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<{ file: File; url: string } | undefined>(
    undefined
  );

  const onOpen = useCallback(
    (state: boolean) => {
      if (state) {
        void (async () => {
          const file = await screenshot();
          if (isNone(file)) return;
          startTransition(() => {
            setOpen(true);
            setFile({ file, url: window.URL.createObjectURL(file) });
          });
        })();
      } else {
        setOpen(false);
      }
    },
    [startTransition, setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          {loading ? <LoadingSpinner /> : <IconCamera />}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden container">
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row-reverse md:space-x-4 md:space-x-reverse">
          <DialogHeader>
            <DialogTitle>Look at what you have built!</DialogTitle>
            <DialogDescription>
              Thanks for sticking all the way to the end! You can share your
              creation with your friends or download it to your device.
              <br />
              By the way. If you want to come back to your small city just click
              the save button and the city will be saved in your browser.
            </DialogDescription>
            <ShareButtons className="hidden md:flex" file={file} />
          </DialogHeader>
          <div className="relative flex flex-col items-center justify-center">
            <GradientEffect />
            <img
              className="w-full rounded-md border-2 shadow-xl "
              src={file?.url}
            />
          </div>
          <ShareButtons className="flex md:hidden" file={file} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const numOfArcs = 3;
const colors = ["to-blue-500/80", "to-green-500/50"]; // ""to-purple-600", "to-amber-500"];
const GradientEffect = () => {
  return (
    <div
      className={
        "absolute inset-0 -z-10  translate-x-1/2 translate-y-1/2 blur-3xl"
      }
    >
      {range(0, numOfArcs).map((i) => (
        <span
          key={`gradient-arc-${i}`}
          style={{ rotate: `${i * (360 / numOfArcs) + Math.random() * 60}deg` }}
          className={cn(
            // translate-x-[15% / 80%]
            "absolute h-[50%] w-[100%] origin-top-left translate-x-[-50px] translate-y-[-50px] rounded-full ",
            "bg-gradient-to-r from-green-300/30",
            colors[i % colors.length]
            // "blur-xl"
            // "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-300 via-cyan-600/50 to-blue-500/20"
          )}
        />
      ))}
    </div>
  );
};
