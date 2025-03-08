export interface IParamForgotPasswordRequest {
  email: string;
}

export interface IResultForgotPasswordRequest {
  token: string;
  session: string;
}

export interface IParamsResetPassword {
  password: string;
  password_confirmation: string;
  session?: string;
}

export interface IResultResetPassword {}
