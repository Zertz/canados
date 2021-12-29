import * as React from "react";

type ControlsProps = {
  children: React.ReactNode;
};

export default function Controls({ children }: ControlsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg max-w-md max-h-[calc(100%-4rem)] fixed top-8 inset-x-8 z-10">
      {children}
    </div>
  );
}
