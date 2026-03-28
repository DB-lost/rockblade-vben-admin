import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie-utils';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import {
  forbiddenResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response';

export default defineEventHandler(async (event) => {
  const { account, accountVoucher, queryEnums } = await readBody(event);

  if (!account || !accountVoucher) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'Account and accountVoucher are required',
    );
  }

  const queryField = queryEnums?.toLowerCase() || 'username';
  const findUser = MOCK_USERS.find((item) => item[queryField] === account);

  if (!findUser) {
    clearRefreshTokenCookie(event);
    return forbiddenResponse(event, 'Account or password is incorrect.');
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);

  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess(accessToken);
});
