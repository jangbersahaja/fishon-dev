import { useEffect, useState } from "react";

import type { MediaPreview } from "../types";

export function useMediaPreviews(files: File[] | undefined | null) {
  const [previews, setPreviews] = useState<MediaPreview[]>([]);

  useEffect(() => {
    if (!files?.length) {
      setPreviews([]);
      return;
    }

    const next = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);

    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  return previews;
}
