import { eventHandler } from 'h3';
import { useResponseSuccess } from '~/utils/response';

const MOCK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw5Z7UhB3d5i0h
-----END PUBLIC KEY-----`;

const MOCK_NONCE = 'mock-nonce-string';

export default eventHandler(() => {
  return useResponseSuccess({
    publicKey: MOCK_PUBLIC_KEY,
    nonce: MOCK_NONCE,
  });
});
