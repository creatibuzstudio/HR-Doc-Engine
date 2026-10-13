import React from "react";

export function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-color-header uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-secondary border border-border focus:border-primary rounded-xl py-2.5 px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition ${
        props.className || ""
      }`}
    />
  );
}

export function FormSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full bg-secondary border border-border focus:border-primary rounded-xl py-2.5 px-3.5 text-xs text-foreground focus:outline-none transition cursor-pointer ${
        props.className || ""
      }`}
    />
  );
}
