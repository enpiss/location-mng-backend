export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface AccessToken {
  access_token: string;
}

export interface AccessTokenWithUserInfo extends AccessToken {
  fullName: string;
  id: string;
  email: string;
}
