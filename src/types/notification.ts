export type NotificationDataResult = {
  key: 'sms' | 'native' | 'email';
  value: boolean;
  type: 'activity' | 'reminder'
}

export type NotificationInitState = {
  data: NotificationDataResult[];
  isLoading: boolean;
  isError: boolean;
  isUpdateSuccess: boolean;
  errorMessage: any;
};
