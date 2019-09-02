import { API } from '../base/api';

export interface FantlabLoginRequest {
  auth: number;
  user_id?: number;
  user_login?: string;
  'X-Session'?: string;
  error_msg?: string;
}

type Login = (login: string, password: string) => Promise<FantlabLoginRequest>;

export default (api: API<any, Login>) =>
  api
    .post('/login')
    .contentType('application/x-www-form-urlencoded')
    .redirect('manual')
    .body((login, password) => ({ login, password }));
