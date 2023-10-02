import ServerConfigurationProvider from '../../../server/configuration/ServerConfigurationProvider';

/* eslint-disable no-new */
const emptyEnv = process.env;
const blaiseApiUrl = 'rest.api.blaise.com';
const buildFolder = '../../build';
const port = 5000;
const serverPark = 'gusty';
const externalWebUrl = 'cati.blaise.com';
const sessionSecret = 'richlikesricecakes';
const sessionTimeout = '12h';
const roles = 'DST';
const rolesArray = ['DST'];

describe('Configuration file tests', () => {
  beforeEach(() => {
    process.env['BLAISE_API_URL'] = blaiseApiUrl;
    process.env['PORT'] = port.toString();
    process.env['SERVER_PARK'] = serverPark;
    process.env['VM_EXTERNAL_WEB_URL'] = externalWebUrl;
  });

  afterEach(() => {
    process.env = { ...emptyEnv };
  });

  it('should populate the properties with values from environement variables when they exist in the environment variables', () => {
    // act
    const sut = new ServerConfigurationProvider();

    // assert
    expect(sut.BlaiseApiUrl).toEqual(blaiseApiUrl);
    expect(sut.BuildFolder).toEqual(buildFolder);
    expect(sut.Port).toEqual(port);
    expect(sut.ServerPark).toEqual(serverPark);
  });

  it.each([undefined, '', ' ', '  '])('should throw an error if the BLAISE_API_URL is empty or does not exist', (value) => {
    // arrange
    process.env['BLAISE_API_URL'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // assert
    expect(configuration).toThrowError('BLAISE_API_URL has not been set or is set to an empty string');
  });

  it.each([undefined, '', ' ', '  '])('should throw an error if the PORT is empty or does not exist', (value) => {
    // arrange
    process.env['PORT'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // act && assert
    expect(configuration).toThrowError('PORT has not been set or is set to an empty string');
  });

  it.each(['NotNumber', 'eight'])('should throw an error if the PORT is not number', (value) => {
    // arrange
    process.env['PORT'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // assert
    expect(configuration).toThrowError(TypeError);
    expect(configuration).toThrowError('PORT is not set to a valid number');
  });

  it.each([undefined, '', '  ', '   '])('should throw an error if SERVER_PARK is empty or does not exist', (value) => {
    // arrange
    process.env['SERVER_PARK'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // assert
    expect(configuration).toThrowError('SERVER_PARK has not been set or is set to an empty string');
  });
});

describe('Authentication file tests', () => {
  beforeEach(() => {
    process.env['SESSION_SECRET'] = sessionSecret;
    process.env['SESSION_TIMEOUT'] = sessionTimeout;
    process.env['ROLES'] = roles;
    process.env['BLAISE_API_URL'] = blaiseApiUrl;
  });

  afterEach(() => {
    process.env = { ...emptyEnv };
  });

  it('should populate the authentication properties with values from environement variables when they exist in the environment variables', () => {
    // act
    const sut = new ServerConfigurationProvider();

    // assert
    expect(sut.SessionSecret).toEqual(sessionSecret);
    expect(sut.SessionTimeout).toEqual(sessionTimeout);
    expect(sut.Roles).toEqual(rolesArray);
    expect(sut.BlaiseApiUrl).toEqual(blaiseApiUrl);
  });

  it.each([undefined, ''])('should return a session secret alpha numeric hex if SESSION_SECRET is empty or does not exist', (value) => {
    // arrange
    process.env['SESSION_SECRET'] = value;

    // act
    const sut = new ServerConfigurationProvider();
    const containsAlphaNumeric = /\d+/g;
    // assert
    expect(sut.SessionSecret.match(containsAlphaNumeric)).toBeTruthy();
  });

  it.each([undefined, '', ' ', '  '])('should be "12h" if the SESSION_TIMEOUT is empty or does not exist', (value) => {
    // arrange
    process.env['SESSION_TIMEOUT'] = value;

    // act
    const sut = new ServerConfigurationProvider();

    // assert
    expect(sut.SessionTimeout).toEqual('12h');
  });

  it.each([undefined, ''])('should return all roles if a role empty or does not exist', (value) => {
    // arrange
    process.env['ROLES'] = value;

    // act
    const sut = new ServerConfigurationProvider();
    const allRoles = ['DST', 'BDSS', 'Researcher'];

    // assert
    expect(sut.Roles).toEqual(allRoles);
  });

  it.each([undefined, '', '  ', '   '])('should throw an error if BLAISE_API_URL is empty or does not exist', (value) => {
    // arrange
    process.env['BLAISE_API_URL'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // act && assert
    expect(configuration).toThrowError('BLAISE_API_URL has not been set or is set to an empty string');
  });

  it.each([undefined, '', '  ', '   '])('should throw an error if VM_EXTERNAL_WEB_URL is empty or does not exist', (value) => {
    // arrange
    process.env['VM_EXTERNAL_WEB_URL'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // assert
    expect(configuration).toThrowError('VM_EXTERNAL_WEB_URL has not been set or is set to an empty string');
  });
});
