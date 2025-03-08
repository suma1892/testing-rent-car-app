export type Participant = {
  id: number;
  photo: string | null;
  user_id: string;
  user_name: string;
};

export type Room = {
  assignee_admin_id?: string;
  code?: string;
  id?: number;
  is_active?: boolean;
  user_name?: string;
  name: string;
  participants?: Participant[];
  room_type: string;
  to?: string;
  driver_name?: string;
  transaction_key?: string;
};

export type ItemChat = {
  file: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
};
