import Configuration from '../../../server/configuration/configurationProvider';

/* eslint-disable no-new */

describe('Configuration file tests', () => {
  const emptyEnv = process.env;
  const blaiseApiUrl = 'rest.api.blaise.com';
  const buildFolder = '../../build';
  const port = 5000;
  const serverPark = 'gusty';
  const externalWebUrl = 'cati.blaise.com';

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
    const sut = new Configuration();

    // assert
    expect(sut.BlaiseApiUrl).toEqual(blaiseApiUrl);
    expect(sut.BuildFolder).toEqual(buildFolder);
    expect(sut.Port).toEqual(port);
    expect(sut.ServerPark).toEqual(serverPark);
    expect(sut.ExternalWebUrl).toEqual(externalWebUrl);
  });

  it.each([undefined, '', ' ', '  '])('should throw an error if the BLAISE_API_URL is empty or does not exist', (value) => {
    // arrange
    process.env['BLAISE_API_URL'] = value;

    // act && assert
    expect(() => { new Configuration(); }).toThrowError('BLAISE_API_URL has not been set or is set to an empty string');
  });

  it.each([undefined, '', ' ', '  '])('should throw an error if the PORT is empty or does not exist', (value) => {
    // arrange
    process.env['PORT'] = value;

    // act && assert
    expect(() => { new Configuration(); }).toThrowError('PORT has not been set or is set to an empty string');
  });

  it.each(['NotNumber', 'eight'])('should throw an error if the PORT is not number', (value) => {
    // arrange
    process.env['PORT'] = value;
    const configuration = () => { new Configuration(); };

    // act && assert
    expect(configuration).toThrowError(TypeError);
    expect(configuration).toThrowError('PORT is not set to a valid number');
  });

  it.each([undefined, '', '  ', '   '])('should throw an error if SERVER_PARK is empty or does not exist', (value) => {
    // arrange
    process.env['SERVER_PARK'] = value;
    const configuration = () => { new Configuration(); };

    // act && assert
    expect(configuration).toThrowError('SERVER_PARK has not been set or is set to an empty string');
  });

  it.each([undefined, '', '  ', '   '])('should throw an error if VM_EXTERNAL_WEB_URL is empty or does not exist', (value) => {
    // arrange
    process.env['VM_EXTERNAL_WEB_URL'] = value;
    const configuration = () => { new Configuration(); };

    // act && assert
    expect(configuration).toThrowError('VM_EXTERNAL_WEB_URL has not been set or is set to an empty string');
  });
});
