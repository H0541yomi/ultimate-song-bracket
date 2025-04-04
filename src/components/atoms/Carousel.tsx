import { Carousel as AntCarousel } from "antd";
import React, { ReactNode } from "react";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "100vh",
  color: "#fff",
  lineHeight: "160px",
  background: "#364d79",
};

interface Props {
  children: ReactNode[];
}

const Carousel: React.FC<Props> = ({ children }) => (
  <>
    <AntCarousel arrows infinite={false} dotPosition="left">
      {children.map((children, index) => (
        <div key={index}>
          <h3 style={contentStyle}>{children}</h3>
        </div>
      ))}
    </AntCarousel>
  </>
);

export default Carousel;
