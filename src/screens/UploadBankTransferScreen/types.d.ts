import {RootStackParamList} from 'types/navigator';
import {RouteProp} from '@react-navigation/native';

export type UploadBankTransferScreenRouteProp = RouteProp<
  RootStackParamList,
  'BankTransfer'
>;

export type UploadBankTransferFormData = {
  sender_name: string;
  sender_bank_name: string;
  disbursement_confirmation_image: any;
  disbursement_confirmation_image_size: number | string;
};

export type UploadBankTransferFormError = {
  sender_name: string;
  sender_bank_name: string;
  disbursement_confirmation_image: string;
};
