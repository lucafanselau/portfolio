import { Slot } from "@radix-ui/react-slot";
import { forwardRef, useState } from "react";
import { Button, ButtonProps } from "./button";

const AsyncButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { onAsyncClick: (event: any) => Promise<void> }
>(({ asChild = false, onAsyncClick, ...props }, ref) => {
  const Comp = asChild ? Slot : Button;
  const [disabled, setDisabled] = useState(props.disabled);

  const onClick = async (event: any) => {
    setDisabled(true);
    await onAsyncClick(event);
    setDisabled(false);
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
