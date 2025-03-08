import { ImageSourcePropType } from "react-native";

export interface IIconAction {
    icon:ImageSourcePropType;
    onPress?: () => void;
  }