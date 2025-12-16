import type { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  return (
    <div className="flex w-full justify-center items-center h-52 text-white font-bold bg-red-500">
      {children}
    </div>
  );
};
