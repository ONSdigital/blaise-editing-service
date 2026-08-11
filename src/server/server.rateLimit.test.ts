/* @vitest-environment node */
import { Request } from 'express';
import { IMock, Mock } from 'typemoq';
import { vi } from 'vitest';
import { Auth } from 'blaise-login-react/blaise-login-react-server';
import BlaiseApi from './BlaiseApi';
import FakeServerConfigurationProvider from './test-utils/FakeServerConfigurationProvider';

const rateLimitMock = vi.hoisted(() => vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()));

vi.mock('express-rate-limit', () => ({
  rateLimit: rateLimitMock,
}));

import nodeServer from './server';

function createRequest(path: string, forwardedHeader?: string, ip = '127.0.0.1'): Request {
  return {
    path,
    ip,
    header: (name: string) => (name.toLowerCase() === 'forwarded' ? forwardedHeader : undefined),
  } as unknown as Request;
}

describe('server rate limiting configuration', () => {
  const configFake = new FakeServerConfigurationProvider();
  const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

  beforeEach(() => {
    rateLimitMock.mockClear();
  });

  it('registers page and api rate limiters with route-aware skip logic', () => {
    nodeServer(configFake, undefined as unknown as never, { blaiseApi: blaiseApiMock.object });

    expect(rateLimitMock).toHaveBeenCalledTimes(2);

    const pageOptions = rateLimitMock.mock.calls[0][0] as {
      skip: (request: Request) => boolean;
    };
    const apiOptions = rateLimitMock.mock.calls[1][0] as {
      skip: (request: Request) => boolean;
    };

    expect(pageOptions.skip(createRequest('/api/surveys'))).toBe(true);
    expect(pageOptions.skip(createRequest('/'))).toBe(false);
    expect(apiOptions.skip(createRequest('/api/surveys'))).toBe(false);
    expect(apiOptions.skip(createRequest('/'))).toBe(true);
  });

  it('uses forwarded header value for page limiter key when present', () => {
    nodeServer(configFake, undefined as unknown as never, { blaiseApi: blaiseApiMock.object });

    const pageOptions = rateLimitMock.mock.calls[0][0] as {
      keyGenerator: (request: Request) => string;
    };

    const key = pageOptions.keyGenerator(createRequest('/', 'for="203.0.113.9:1234"', '10.0.0.1'));

    expect(key).toBe('ip:203.0.113.9');
  });

  it('uses authenticated username for api limiter key and falls back to ip when unavailable', () => {
    const authMock = {
      GetToken: vi.fn(() => 'token'),
      GetUser: vi.fn(() => ({ name: 'Editor.User' })),
      Middleware: (_req: unknown, _res: unknown, next: () => void) => next(),
    } as unknown as Auth;

    nodeServer(configFake, undefined as unknown as never, { blaiseApi: blaiseApiMock.object, auth: authMock });

    const apiOptions = rateLimitMock.mock.calls[1][0] as {
      keyGenerator: (request: Request) => string;
    };

    const userKey = apiOptions.keyGenerator(createRequest('/api/surveys', undefined, '10.0.0.1'));
    expect(userKey).toBe('user:editor.user');

    authMock.GetToken = vi.fn(() => {
      throw new Error('no token');
    }) as unknown as Auth['GetToken'];

    const fallbackKey = apiOptions.keyGenerator(createRequest('/api/surveys', 'for=198.51.100.7', '10.0.0.1'));
    expect(fallbackKey).toBe('ip:198.51.100.7');
  });
});
