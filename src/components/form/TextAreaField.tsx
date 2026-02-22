import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { countWords } from '@/utils/validation';

interface TextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxWords?: number;
  rows?: number;
}

export default function TextAreaField({
  name,
  label,
  placeholder,
  required,
  maxWords,
  rows = 5,
}: TextAreaFieldProps) {
  const { register, watch, formState: { errors } } = useFormContext();
  const error = errors[name];
  const value = watch(name) || '';
  const wordCount = countWords(value);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        {...register(name)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full focus:ring-2 focus:ring-ring resize-y"
      />
      <div className="flex justify-between">
        {error ? (
          <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
            {error.message as string}
          </p>
        ) : <span />}
        {maxWords && (
          <span className={`text-xs ${wordCount > maxWords ? 'text-destructive' : 'text-muted-foreground'}`}>
            {wordCount} / {maxWords} words
          </span>
        )}
      </div>
    </div>
  );
}
