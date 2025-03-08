import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {IPayments, IRegisterVerificationStep} from './global.types';
import {IRentalLocationResult} from './rental-location.types';
import {DriverData, IOrder} from './my-booking.types';
import {Room} from './websocket.types';

type RootStackParamList = {
  ProductDetail: {productId: string};
  MainTab?: RootTabParamList;
  UserInformationPayment: {
    func: () => void;
  };
  ChatRoom: {
    room: Room;
    type: 'driver-admin' | 'driver-customer' | 'customer-driver';
    funcHelpCenter?: () => void;
  };
  RefundProcess: {
    item: IOrder;
  };
  OrderDetailAirportTransfer: undefined;
  NotificationList: undefined;
  Login?: {
    previousScreen?: string;
    referralCode?: string;
  };
  SelectMapLocation: {
    prev_screen: 'pickup' | 'dropoff';
  };
  OneWayService: {
    district: IRentalLocationResult;
    date?: string;
    time?: string;
  };
  OneWayDetailBooking: {
    item: IOrder;
    package: any;
  };
  AdditionalItem: undefined;
  Auth: undefined;
  Register?: {
    referralCode?: string;
  };
  OrderSchedule: {
    date?: string;
    time?: string;
  };
  PaymentWebView: {
    selectedPayment: IPayments;
    transaction_key: string;
    redirect_url?: string;
  };
  InfoPaymentSuccessScreen: undefined;
  DetailVoucher: {
    voucherId: string | number;
    status?: string;
    _funcClaim?: () => void;
    _funcUse?: () => void;
  };
  RegisterPassword: {
    referralCode?: string;
  };
  RegisterVerification: {
    page: IRegisterVerificationStep;
    referralCode?: string;
  };
  ForgotPasswordOtpInput: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    session?: string;
    token?: string;
  };
  HistoryPoint: undefined;
  DailyListCar: undefined;
  AirportListCar: undefined;
  DetailCar: {
    vehicle_id: number;
    location_id?: number;
    sub_service_id?: number;
  };
  Loyalty: undefined;
  RefferalCode: undefined;
  AirportDetailCar: {
    vehicle_id: number;
  };
  OrderDetail: undefined;
  PaymentMethod?: {
    transaction_key: string;
  };
  DailyBookingOrderDetailScreen: {
    transaction_key: string;
    packageActive?: any;
  };
  AirportTransferBookingOrderDetailScreen: {
    transaction_key: string;
    packageActive: any;
    item: IOrder;
  };
  AirportTransferBookingOrderDetailSgScreen: {
    transaction_key: string;
    packageActive: any;
    item: IOrder;
  };
  CardPayment: {
    selectedPayment: IPayments;
    transaction_key?: string;
  };
  VirtualAccount: {
    selectedPayment: IPayments;
    transaction_key: string;
  };
  BankTransfer: {
    selectedPayment: IPayments;
    transaction_key?: string;
    reconfirmation?: boolean | false;
  };
  ProofTransfer: {
    selectedPayment: IPayments;
    transaction_key?: string;
    reconfirmation?: boolean | false;
  };
  UploadBankTransfer: {
    selectedPayment: IPayments;
    transaction_key?: string;
  };
  InstantPayment: {
    selectedPayment: IPayments;
    transaction_key: string;
  };
  Profile: {
    prev_screen?: 'without_driver';
  };
  ChangePassword: undefined;
  Notification: undefined;
  UserInformation: undefined;
  ReferralCode: {
    referralCode?: string;
  };
  ReferralCodeDeeplink: {
    referralCode: string;
  };
  InboxDetail: {
    id: number;
  };
  CodepushUpdateManager: {failedInstall: boolean};
  HelpCenter: undefined;
  OnBoarding: undefined;
  RentalZone: {
    selectedId: number;
  };
  CompanyProfile: undefined;
  DeleteAccountConfirmation: undefined;
  DeleteAccountOtp: undefined;
  SuccessDeleteAccount: undefined;
  ApprovalUpdateOrder: {
    transactionKey: string;
  };
  RefundStatus: {
    transaction_key: string;
  };
};

type RootTabParamList = {
  Home: undefined;
  Booking: undefined;
  Inbox: undefined;
  Account: undefined;
  Voucher: undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

type navigationProps = StackNavigationProp<RootStackParamList>;

export type {RootStackParamList, RootTabParamList, navigationProps};
