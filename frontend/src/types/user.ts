export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  national_code: string;
  roles: { id: number; name: string }[];
}