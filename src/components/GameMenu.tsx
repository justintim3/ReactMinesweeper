import { HTMLAttributes, InputHTMLAttributes, useState } from "react";
import styled from "styled-components";

import { Link } from "./Link";

const CUSTOM_INDEX = 3;

export type GameMenuProps = {
  onClose: () => void;
  onNewGame: (difficulty: Difficulty) => void;
} & HTMLAttributes<HTMLDivElement>;

export type Difficulty = {
  name: string;
  height: number;
  width: number;
  mines: number;
};

export const defaultDifficulties: Difficulty[] = [
  { name: "Beginner", height: 9, width: 9, mines: 10 },
  { name: "Intermediate", height: 16, width: 16, mines: 40 },
  { name: "Expert", height: 16, width: 30, mines: 99 },
  { name: "Custom", height: 20, width: 30, mines: 145 }
];

const Container = styled.div`
  position: fixed;
  top: 110px;
  font-family: sans-serif;
  font-size: 14px;
`;

const Header = styled.div`
  background-color: blue;
  color: white;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  height: 24px;
`;

const Body = styled.div`
  background-color: rgba(200, 200, 200, 0.9);
  padding: 2px;
`;

const RadioButton = styled.input`
  background-color: grey;
  opacity: 0.8;
`;

const DifficultyRow = styled.div`
  height: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const DifficultyCell = styled.div`
  width: 50px;
`;

const RadioButtonBox = styled.div`
  width: 120px;
  font-style: bold;
  display: flex;
  flex-direction: row;
`;

const Bold = styled.div`
  font-weight: bold;
`;

const DifficultyTextBox = styled.input`
  width: 80%;
`;

const TextBox = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <DifficultyTextBox type="text" maxLength={4} {...props} />
);

export const GameMenu = ({ onClose, onNewGame, ...rest }: GameMenuProps) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const [difficulties, setDifficulties] = useState(defaultDifficulties);

  return (
    <Container {...rest}>
      <Header>
        Game
        <Link onClick={onClose}>&times;</Link>
      </Header>
      <Body>
        <DifficultyRow>
          {["Height", "Width", "Mines"].map((column, index) => (
            <DifficultyCell key={index}>
              <Bold>{column}</Bold>
            </DifficultyCell>
          ))}
        </DifficultyRow>
        {difficulties.map(({ name, height, width, mines }, index) => {
          const onClick = () => {
            setselectedIndex(index);
          };
          return (
            <DifficultyRow key={index}>
              <Link>
                <RadioButtonBox>
                  <RadioButton
                    checked={selectedIndex === index}
                    onChange={onClick}
                    type={"radio"}
                  />
                  <Bold onClick={onClick}>{name}</Bold>
                </RadioButtonBox>
              </Link>
              {[height, width, mines].map((num, index) => (
                <DifficultyCell key={index}>
                  {name === "Custom" ? (
                    <TextBox
                      onInput={(event) => {
                        const value = (event.target as HTMLTextAreaElement)
                          .value;
                        let parsedValue = parseInt(value, 10);
                        if (isNaN(parsedValue)) {
                          parsedValue = 0;
                        }

                        const newState = [...difficulties];
                        const currentDifficulty = newState[CUSTOM_INDEX];
                        newState[CUSTOM_INDEX] = {
                          ...currentDifficulty,
                          [Object.keys(currentDifficulty)[
                            index + 1
                          ]]: parsedValue
                        };
                        setDifficulties(newState);
                      }}
                      value={num}
                    />
                  ) : (
                    num
                  )}
                </DifficultyCell>
              ))}
            </DifficultyRow>
          );
        })}
        <button
          onClick={() => {
            const customDifficulty = { ...difficulties[CUSTOM_INDEX] };

            // Ensure values are within range. Reset to default value if out of range.
            if (customDifficulty.height < 1 || customDifficulty.height > 99) {
              customDifficulty.height =
                defaultDifficulties[CUSTOM_INDEX].height;
            }
            if (customDifficulty.width < 8 || customDifficulty.width > 99) {
              customDifficulty.width = defaultDifficulties[CUSTOM_INDEX].width;
            }
            if (customDifficulty.mines < 0) {
              customDifficulty.mines = 0;
            } else if (
              customDifficulty.mines >=
              customDifficulty.height * customDifficulty.width
            ) {
              customDifficulty.mines =
                customDifficulty.height * customDifficulty.width - 1;
            }

            const newDifficulties = [...difficulties];
            newDifficulties[CUSTOM_INDEX] = customDifficulty;
            setDifficulties(newDifficulties);

            onNewGame(newDifficulties[selectedIndex]);
          }}
        >
          New Game
        </button>
      </Body>
    </Container>
  );
};
