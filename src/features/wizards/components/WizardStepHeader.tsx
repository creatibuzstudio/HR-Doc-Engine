import React from "react";

interface WizardStepHeaderProps {
  steps: string[];
  currentStep: number;
}

export default function WizardStepHeader({
  steps,
  currentStep,
}: WizardStepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;

          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : isDone
                    ? "bg-secondary border border-primary text-primary"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                {stepNum}
              </span>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  isActive
                    ? "text-foreground"
                    : isDone
                    ? "text-color-header"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
