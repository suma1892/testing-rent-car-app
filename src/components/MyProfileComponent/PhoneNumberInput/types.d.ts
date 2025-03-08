type PhoneNumberInputProps = {
  onChangeText: (countryCode: string, text: string) => void;
  value?: string;
  placeholder: string;
  editable?: boolean
  defaultCode?: string
};

type RenderItemData = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};
