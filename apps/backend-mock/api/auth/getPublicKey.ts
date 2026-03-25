import { eventHandler } from 'h3';
import { useResponseSuccess } from '~/utils/response';

const MOCK_PUBLIC_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDu67CWxuli4Rz0ojO1h09oNVg49+0lE61EebNf\r\n0la/LwTSiIvWCan6ZPaSeHt1fFw9mq6K+ZgMs9nrJ5/d0InpTXnMCLnknHf7xAhltGyNKYNEPq+s\r\nWWrfmlrurav4+ROheU8m+Kg/RbK5mF8ncKvjxtgOxGm9Ocl9WKg39fV7SQIDAQAB`;

const MOCK_NONCE = 'mock-nonce-string';

export default eventHandler(() => {
  return useResponseSuccess({
    publicKey: MOCK_PUBLIC_KEY,
    nonce: MOCK_NONCE,
  });
});
