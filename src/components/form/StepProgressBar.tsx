import { stepTitles } from '@/schemas/studentFormSchema';
import { Check } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export default function StepProgressBar({ currentStep, completedSteps }: StepProgressBarProps) {
  return (
    <div className="w-full">
      {/* Desktop progress */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {stepTitles.map((title, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-secondary text-secondary-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={`mt-1.5 text-[10px] leading-tight text-center max-w-[72px] ${
                    isCurrent ? 'font-semibold text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {title}
                </span>
              </div>
              {index < stepTitles.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                    isCompleted ? 'bg-secondary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile progress */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {stepTitles.length}
          </span>
          <span className="text-sm text-muted-foreground">{stepTitles[currentStep]}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / stepTitles.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
