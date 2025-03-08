import { ImageSourcePropType } from "react-native";

export type InfoProps = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
  show?: boolean;
};

export type BottomPriceButtonActionProps = {
  disabled: boolean;
}