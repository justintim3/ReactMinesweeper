import styled from "styled-components";

import Digital7 from "./assets/fonts/digital-7.mono.ttf";
import { Game } from "./components/Game";

const Container = styled.div`
  @font-face {
    font-family: "Digital-7 Mono";
    src: url(${Digital7}) format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
`;

const GameContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: scroll;
`;

document.oncontextmenu = () => false;

export default function App() {
  return (
    <Container className="App">
      <h1>Minesweeper</h1>
      <GameContainer>
        <Game />
      </GameContainer>
    </Container>
  );
}
