export class User {
  constructor(
    // public email: string,
    // public id: string,
    // public username: string,
    // public orgId: string,
    public _id: string,
    public role: string,
    public _token: string, // private _tokenExpirationDate: Date
    public username: string,
    public designation: number | null,
    public organization: number | null // public exp: number,
  ) // public iat: number
  {}
  get token() {
    // if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
    //   return null;

    return this._token;
  }
}
