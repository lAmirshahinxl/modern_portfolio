"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import "./counter.css";

export type CounterPlace = number | ".";
export type CounterDirection = "up" | "down";

export interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: CounterPlace[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: string | number;
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
  instant?: boolean;
  direction?: CounterDirection;
}

function CounterNumber({
  motionValue,
  number,
  height,
  direction,
}: {
  motionValue: ReturnType<typeof useSpring>;
  number: number;
  height: number;
  direction: CounterDirection;
}) {
  const y = useTransform(motionValue, (latest) => {
    const placeValue = latest % 10;
    const offset = direction === "down"
      ? (10 + placeValue - number) % 10
      : (10 + number - placeValue) % 10;
    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num: number) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

function Digit({
  place,
  value,
  height,
  digitStyle,
  instant,
  direction,
}: {
  place: CounterPlace;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
  instant: boolean;
  direction: CounterDirection;
}) {
  const isDecimal = place === ".";
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    if (!isDecimal) {
      if (instant) {
        animatedValue.jump(valueRoundedToPlace);
      } else {
        animatedValue.set(valueRoundedToPlace);
      }
    }
  }, [animatedValue, instant, isDecimal, valueRoundedToPlace]);

  if (isDecimal) {
    return (
      <span className="counter-digit" style={{ height, ...digitStyle, width: "fit-content" }}>
        .
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, number) => (
        <CounterNumber key={number} motionValue={animatedValue} number={number} height={height} direction={direction} />
      ))}
    </span>
  );
}

export function getCounterPlaces(value: number): CounterPlace[] {
  const characters = value.toString().split("");
  const decimalIndex = characters.indexOf(".");

  return characters.map((character, index) => {
    if (character === ".") {
      return ".";
    }

    return 10 ** (
      decimalIndex === -1
        ? characters.length - index - 1
        : index < decimalIndex
          ? decimalIndex - index - 1
          : -(index - decimalIndex)
    );
  });
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = getCounterPlaces(value),
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "inherit",
  fontWeight = "inherit",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
  instant = false,
  direction = "up",
}: CounterProps) {
  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap,
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight,
    direction: "ltr",
  };
  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };
  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place, index) => (
          <Digit
            key={`${place}-${index}`}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
            instant={instant}
            direction={direction}
          />
        ))}
      </span>
      <span className="gradient-container">
        <span className="top-gradient" style={topGradientStyle ?? defaultTopGradientStyle} />
        <span className="bottom-gradient" style={bottomGradientStyle ?? defaultBottomGradientStyle} />
      </span>
    </span>
  );
}
