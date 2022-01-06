import * as React from "react";

type ControlsProps = {
  children: React.ReactNode;
};

export default function Controls({ children }: ControlsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg max-h-[calc(100%-4rem)] fixed top-2 left-2 z-10">
      {children}
    </div>
  );
}
