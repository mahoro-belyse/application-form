import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxFieldProps {
  name: string;
  label: string;
  required?: boolean;
}

export default function CheckboxField({ name, label, required }: CheckboxFieldProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value === true}
              onCheckedChange={field.onChange}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className="mt-0.5"
            />
          )}
        />
        <Label htmlFor={name} className="text-sm font-normal text-foreground leading-snug cursor-pointer">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
