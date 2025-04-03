import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  height: number;
  width: number;
}

const VerticalPanel = ({ children, height, width }: Props) => {
  return (
    <div className={`h-[300px] w-[300px] bg-blue-300`}>
      {children}
    </div>
  );
};

export default VerticalPanel;
