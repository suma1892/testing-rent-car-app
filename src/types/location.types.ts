export interface ILocation {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
}
export interface IFormLocation {
  detail: string;
  location: ILocation;
}

export type Iorder_driver_tasks = {
  status: 'ON_PICK_UP_LOCATION';
  driver_id: string;
  refund_order: string | number;
  task_type: string;
};
