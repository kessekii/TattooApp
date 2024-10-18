//general reusable page component using tailwind
import React from "react";

export const Page = ({ children }: any) => {
  return <div className="container mx-auto p-4">{children}</div>;
};
