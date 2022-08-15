import { HTMLAttributes, PropsWithChildren } from "react";
import styled from "styled-components";

import { Link } from "./Link";

export type GameInfoProps = {
  emojiIcon: string;
  remainingMines: number;
  time: number;
  onNewGame: () => void;
} & PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  -ms-user-select: none;
  -user-webkit-user-select: none;
`;

const NumberText = styled.div`
  background-color: black;
  color: red;
  font-size: 32px;
  font-family: "Digital-7 Mono", sans-serif;
`;

const NewGameButton = styled(Link)`
  font-size: 27px;
`;

const formatNumber = (num: number) => `${num < 0 ? 0 : num}`.padStart(3, "0");

export const GameInfo = ({
  emojiIcon,
  remainingMines,
  time,
  onNewGame,
  ...rest
}: GameInfoProps) => {
  return (
    <Container {...rest}>
      <NumberText>{formatNumber(remainingMines)}</NumberText>
      <NewGameButton onClick={onNewGame}>{emojiIcon}</NewGameButton>
      <NumberText>{formatNumber(time)}</NumberText>
    </Container>
  );
};
