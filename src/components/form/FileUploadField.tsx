import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { validateFile } from '@/utils/validation';
import { Upload, X } from 'lucide-react';

interface FileUploadFieldProps {
  name: string;
  label: string;
  accept: string;
  maxSize: number;
  allowedTypes: string[];
  description: string;
  required?: boolean;
  onFileChange?: (file: File | null) => void;
}

export default function FileUploadField({
  name,
  label,
  accept,
  maxSize,
  allowedTypes,
  description,
  required,
  onFileChange,
}: FileUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    const validationError = validateFile(selected, { maxSize, types: allowedTypes });
    if (validationError) {
      setError(validationError);
      setFile(null);
      onFileChange?.(null);
      return;
    }

    setError(null);
    setFile(selected);
    onFileChange?.(selected);
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="border-2 border-dashed border-border rounded-md p-4 text-center hover:border-accent transition-colors">
        {file ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground truncate">{file.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label htmlFor={name} className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{description}</span>
          </label>
        )}
        <input
          ref={inputRef}
          id={name}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
