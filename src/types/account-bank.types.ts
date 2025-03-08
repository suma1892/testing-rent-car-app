export type ParamCreateAccountBank = {
  name_rek: string;
  name_bank: string;
  no_rek: string;
  password?: string;
};

export type ParamUpdateAccountBank = {
  name_rek: string;
  name_bank: string;
  no_rek: string;
  password: string;
  id: string;
};
