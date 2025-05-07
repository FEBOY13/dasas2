import * as React from "react";
import { cn } from "@/lib/utils";
import { formatCPF, formatPhone } from "@/lib/utils";

export interface InputMaskedProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: "cpf" | "phone";
}

const InputMasked = React.forwardRef<HTMLInputElement, InputMaskedProps>(
  ({ className, mask, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      let formattedValue = rawValue;
      
      if (mask === "cpf") {
        formattedValue = formatCPF(rawValue);
      } else if (mask === "phone") {
        formattedValue = formatPhone(rawValue);
      }
      
      // Set the formatted value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(e.target, formattedValue);
        const event = new Event('input', { bubbles: true });
        e.target.dispatchEvent(event);
      }
      
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={handleChange}
        value={value}
        ref={ref}
        {...props}
      />
    );
  }
);

InputMasked.displayName = "InputMasked";

export { InputMasked };
