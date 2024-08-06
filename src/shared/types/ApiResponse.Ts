export class ApiResponse {
  ok: boolean;
  payload: any;
  message?: string;
  error?: string | {};

  constructor({
    ok = true,
    payload = {},
    message = undefined,
    error = undefined,
  }) {
    this.ok = ok;
    this.payload = payload;
    this.message = message;
    this.error = error;
  }
}
