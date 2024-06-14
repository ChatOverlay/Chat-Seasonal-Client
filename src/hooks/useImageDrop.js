import { useCallback } from "react";

export function useImageDrop(setPreviews, setImages) {
  return useCallback(
    (acceptedFiles) => {
      const supportedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "heic"];
      acceptedFiles.forEach((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (supportedExtensions.includes(fileExtension)) {
          if (file.size > 10 * 1024 * 1024) { // 크기 제한
            alert("파일 크기가 너무 큽니다. 최대 10MB까지 가능합니다.");
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews((prev) => [...prev, reader.result]);
            setImages((prev) => [...prev, file]);
          };
          reader.onerror = () => {
            alert(`${file.name}를 읽기 실패했습니다.`);
          };
          reader.readAsDataURL(file);
        } else {
          alert(`${fileExtension}은 지원되지 않습니다.`);
        }
      });
    },
    [setPreviews, setImages]
  );
}
