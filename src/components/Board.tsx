import { HTMLAttributes, PropsWithChildren } from "react";
import styled from "styled-components";

import { squareSize } from "./Square";

export type BoardProps = {
  width: number;
  height: number;
} & PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const Container = styled.div`
  display: grid;
  user-select: none;
  -ms-user-select: none;
  -user-webkit-user-select: none;
`;

export const Board = ({
  width,
  height,
  style,
  children,
  ...rest
}: BoardProps) => {
  return (
    <Container
      {...rest}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${width}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${height}, ${squareSize}px)`
      }}
    >
      {children}
    </Container>
  );
};
