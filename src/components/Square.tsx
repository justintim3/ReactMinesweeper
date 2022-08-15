import styled from "styled-components";

const defaultSquareStyle = {
  height: 25,
  width: 25,
  borderColor: "black",
  borderWidth: 1,
  borderStyle: "solid",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export const squareSize =
  defaultSquareStyle.width + defaultSquareStyle.borderWidth;
export const Square = styled.div(defaultSquareStyle);
