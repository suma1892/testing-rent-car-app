import {ReactNode} from 'react';
import {ImageSourcePropType, KeyboardType} from 'react-native';

type CommonProps = {
  errorMessage?: string;
  value?: string;
  label: string;
  placeholder: string;
  includeCheckbox?: ReactNode;
  editable?: boolean;
  maxLength?: number;
};

type ConditionalInputType =
  | {
      type?: 'default';
      keyboardType?: KeyboardType;
      rightImageSource?: ImageSourcePropType;
      onChangeText: (text: string) => void;
      defaultCode?: never;
    }
  | {
      type?: 'phone_number';
      keyboardType?: never;
      rightImageSource?: never;
      onChangeText: (countryCode: string, text: string) => void;
      defaultCode?: string;
    };

export type ProfileTextInputProps = CommonProps & ConditionalInputType;
