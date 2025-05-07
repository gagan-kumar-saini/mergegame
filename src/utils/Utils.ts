import { useCallback } from "react";
import { CELL_SIZE,CELL_MARGIN,BOARD_SIZE } from "./Constants";
import { TilePosition } from "../types/GameTypes";


export const getTextColor = (value: number): string => {
    return value == 4 ? '#000' : '#FFF';
  };

export const getFontSize = (value: number): number => {
    const numDigits = value.toString().length;
    return numDigits <= 2 ? 24 : numDigits === 3 ? 20 : 16;
  };


