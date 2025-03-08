import React from 'react';
import {IRentalZone, IZone} from 'types/order';
import {OrderBookingZone} from 'types/global.types';

export type MyRentalZoneSectionProps = {
  form: any;
  setForm: any;
  setSelectedZoneLabel: React.Dispatch<React.SetStateAction<string>>;
  isFisrtDay: boolean;
  isLastDay: boolean;
};

export type OptionalCheckBoxProps = {
  form: any;
  setForm: any;
  show: boolean;
};

export type AdditionalRentalZoneInputProps = {
  form: any;
  setForm: any;
  selectedZoneLabel: string;
};

export type PickupLocationInputProps = {
  form: any;
  setForm: any;
  show: boolean;
  temporarySelectedZoneId: number[];
  setTemporarySelectedZoneId: React.Dispatch<React.SetStateAction<number[]>>;
};

export type ReturnLocationInputProps = {
  form: any;
  setForm: any;
  show: boolean;
  temporarySelectedZoneId: number[];
  setTemporarySelectedZoneId: React.Dispatch<React.SetStateAction<number[]>>;
};

export type AirportInputProps = {
  show: boolean;
  form: any;
  setForm: any;
};

export type AreaZoneModalContentProps = {
  onPress: (ids: number[]) => void;
  form: any;
};

export type ButtonAdditionalFeeListProps = {
  show: boolean;
  data: IZone;
};

export type ButtonSaveRentalZoneProps = {
  dayIndex: number;
  lastDayIndex: number;
  form: any;
  setSelectedDropdown: React.Dispatch<React.SetStateAction<number>>;
};

export type OnChangeZone = {
  id: number;
  name: string;
  name_zone: string;
  zone_id: number;
};

export type SelectZoneInputProps = {
  label: string;
  placeholder: string;
  onChange: (val: OnChangeZone) => void;
  modalHeaderTitle: string;
  data?: IRentalZone[];
};

export type RentalZoneFormProps = {
  i: number;
  selectedId: number;
  lastDayIndex: number;
  onSave: (val: any) => void;
  showBadge: boolean;
};

export type SelectZoneModalContentProps = {
  headerTitle: string;
  onPress: (val: OnChangeZone) => void;
  data?: IRentalZone[];
};
