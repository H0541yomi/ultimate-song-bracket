import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
  size: number;
}

const Button = ({ children, onClick, size }: Props) => {
  

  return (
    <div className={"d-grid gap-2 mx-auto col-" + size}>
      <button
        className="btn btn-primary"
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
