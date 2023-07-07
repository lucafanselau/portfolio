import { Slot } from "@radix-ui/react-slot";
import { forwardRef, useState } from "react";
import type { ButtonProps } from "./button";
import { Button } from "./button";

const AsyncButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { onAsyncClick: (event: any) => Promise<void> }
>(({ asChild = false, onAsyncClick, ...props }, ref) => {
  const Comp = asChild ? Slot : Button;
  const [disabled, setDisabled] = useState(props.disabled);

  const onClick = (event: any) => {
    const executor = async () => {
      setDisabled(true);
      await onAsyncClick(event);
      setDisabled(false);
    };
    void executor();
  };

  return (
    <Comp
      ref={ref}
      onClick={onClick}
      {...props}
      disabled={disabled || props.disabled}
    />
  );
});
AsyncButton.displayName = "AsyncButton";

export { AsyncButton };
