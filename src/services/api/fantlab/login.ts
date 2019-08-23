export const method = 'POST';

export const url = '/login';

export const contentType = 'application/x-www-form-urlencoded'

export const redirect = 'manual'

export function mapParams(login, password) {
  return {
    body: `login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`,
  };
}

export type Request = (login: string, password: string) => Promise<FantlabLoginRequest>

export interface FantlabLoginRequest {
  auth: number
  user_id?: number
  user_login?: string
  'X-Session'?: string
  error_msg?: string
}
