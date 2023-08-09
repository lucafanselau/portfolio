import * as React from "react";
import { useProgress } from "@react-three/drei";
import { LoadingAnimation } from "@ui/loader";
import { FullPageGradient } from "@components/random";

interface LoaderOptions {}

const defaultDataInterpolation = (p: number) => `Loading ${p.toFixed(2)}%`;

export function Loader({}: Partial<LoaderOptions>) {
  const { active, progress } = useProgress();
  const progressRef = React.useRef(0);
  const rafRef = React.useRef(0);
  const progressSpanRef = React.useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState(active);

  React.useEffect(() => {
    let t: NodeJS.Timeout;
    if (active !== shown) t = setTimeout(() => setShown(active), 300);
    return () => clearTimeout(t);
  }, [shown, active]);

  const updateProgress = React.useCallback(() => {
    if (!progressSpanRef.current) return;
    progressRef.current += (progress - progressRef.current) / 2;
    if (progressRef.current > 0.95 * progress || progress === 100)
      progressRef.current = progress;
    progressSpanRef.current.innerText = defaultDataInterpolation(
      progressRef.current
    );
    if (progressRef.current < progress)
      rafRef.current = requestAnimationFrame(updateProgress);
  }, [defaultDataInterpolation, progress]);

  React.useEffect(() => {
    updateProgress();
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateProgress]);

  return shown ? (
    <div className="absolute inset-0 bg-background">
      <LoadingAnimation>
        <span ref={progressSpanRef} />
      </LoadingAnimation>
      <FullPageGradient />
    </div>
  ) : null;
}
