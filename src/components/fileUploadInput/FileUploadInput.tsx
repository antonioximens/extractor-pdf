import { memo, RefObject } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  fileInputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
  onChange: (files: File[]) => void;
}

export const FileUploadInput = memo(function FileUploadInput({
  fileInputRef,
  disabled,
  onChange,
}: Props) {
  return (
    <div className="grid w-full items-center gap-3">
      <label
        htmlFor="pdf-upload"
        className="text-lg font-semibold text-slate-700 ml-1"
      >
        Selecione os arquivos PDF
      </label>
      <Input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        multiple
        ref={fileInputRef}
        onChange={(e) => onChange(Array.from(e.target.files ?? []))}
        disabled={disabled}
        className="cursor-pointer file:font-semibold border-slate-200 h-14 text-lg
                   focus-visible:ring-brand-light bg-slate-50"
      />
    </div>
  );
});
