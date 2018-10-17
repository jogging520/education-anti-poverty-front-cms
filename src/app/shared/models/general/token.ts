export class Token {
  session: string;
  user: string;
  lifeTime: number;
  jwt: string;
  downPublicKey: string;
  downPublicKeyExponent?: string;
  downPublicKeyModulus?: string;
  upPrivateKey: string;
  upPrivateKeyExponent?: string;
  upPrivateKeyModulus?: string;
  upPrivateKeyPrimeP?: string;
  upPrivateKeyPrimeQ?: string;
  status: string;
}
