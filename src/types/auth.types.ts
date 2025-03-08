export interface IParamLogin {
  email: string;
  password: string;
}

export interface IParamRegister {
  fullname: string;
  email: string;
  phone?: string;
  wa?: string;
  wa_code?: string;
  code?: string;
}

export interface IResultLogin {
  // kind: string;
  // data?: {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  // }
}

export interface IParamConfirmation {
  session: string;
  token: string;
}
