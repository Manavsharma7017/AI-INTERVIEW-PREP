import { useEffect, useRef, useState } from "react";

interface UseAntiCheatOptions {
  maxWarnings?: number;
  onViolation?: (count: number) => void;
  onMaxViolation?: () => void;
  blockContextMenu?: boolean;
}

export const useAntiCheatProtection = ({
  maxWarnings = 3,
  onViolation,
  onMaxViolation,
  blockContextMenu = true,
}: UseAntiCheatOptions = {}) => {
  const [violationCount, setViolationCount] = useState(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const handleViolation = () => {
      if (triggeredRef.current) return;

      setViolationCount((prev) => {
        const newCount = prev + 1;
        if (onViolation) onViolation(newCount);

        if (newCount >= maxWarnings && onMaxViolation) {
          onMaxViolation();
          triggeredRef.current = true;
        }

        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation();
    };

    const handleBlur = () => {
      handleViolation();
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (blockContextMenu) e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    if (blockContextMenu) {
      document.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      if (blockContextMenu) {
        document.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, [maxWarnings, onViolation, onMaxViolation, blockContextMenu]);

  return { violationCount };
};
