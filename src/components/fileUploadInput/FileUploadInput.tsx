import { Input } from "@/components/ui/input";
import { RefObject } from "react";

interface Props {
  fileInputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
  onChange: (file: File | null) => void;
}

export function FileUploadInput({ fileInputRef, disabled, onChange }: Props) {
  return (
    <div className="grid w-full items-center gap-3">
      <label
        htmlFor="pdf-upload"
        className="text-lg font-semibold text-slate-700 ml-1"
      >
        Selecione o arquivo PDF
      </label>
      <Input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        disabled={disabled}
        className="cursor-pointer file:font-semibold border-slate-200 h-14 text-lg
                   focus-visible:ring-brand-light bg-slate-50"
      />
    </div>
  );
}
