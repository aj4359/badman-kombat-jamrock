import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // 80's Combat Variants
        neon: "bg-gradient-neon text-primary-foreground font-retro font-bold shadow-neon-cyan hover:shadow-neon-pink hover:scale-105 active:scale-95 border border-neon-cyan/50",
        combat: "bg-gradient-retro text-primary-foreground font-retro font-bold shadow-combat hover:shadow-neon-green hover:bg-gradient-jamaica transition-all duration-300 border-2 border-neon-green/70 hover:border-neon-pink",
        retro: "bg-card/80 backdrop-blur-sm text-neon-cyan border-2 border-neon-cyan/50 font-retro font-bold hover:bg-neon-cyan/20 hover:text-neon-pink hover:border-neon-pink shadow-neon-cyan",
        jamaica: "bg-gradient-jamaica text-background font-retro font-bold shadow-combat hover:shadow-neon-green hover:scale-105 active:scale-95",
        cyber: "bg-card/30 backdrop-blur text-neon-green border border-neon-green/50 font-retro hover:bg-neon-green/20 hover:text-neon-cyan hover:border-neon-cyan shadow-neon-green",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
