import { CaseOutcome } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
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
const roles = 'SVT Supervisor,SVT Editor';
const rolesList = ['SVT Supervisor', 'SVT Editor'];
const surveys = 'FRS';
const projectID = 'ons-blaise';

describe('Configuration file tests', () => {
  beforeEach(() => {
    process.env['BLAISE_API_URL'] = blaiseApiUrl;
    process.env['PORT'] = port.toString();
    process.env['SERVER_PARK'] = serverPark;
    process.env['VM_EXTERNAL_WEB_URL'] = externalWebUrl;
    process.env['PROJECT_ID'] = projectID;
  });

  afterEach(() => {
    process.env = { ...emptyEnv };
  });

  it('should populate the properties with values from environement variables when they exist in the environment variables', () => {
    // act
    const sut = new ServerConfigurationProvider();

    // assert
    expect(sut.BlaiseApiUrl).toEqual(`http://${blaiseApiUrl}`);
    expect(sut.BuildFolder).toEqual(buildFolder);
    expect(sut.Port).toEqual(port);
    expect(sut.ServerPark).toEqual(serverPark);
    expect(sut.ProjectID).toEqual(projectID);
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

  it.each([undefined, '', ' ', '  '])('should throw an error if the PROJECT_ID is empty or does not exist', (value) => {
    // arrange
    process.env['PROJECT_ID'] = value;

    // act
    const configuration = () => { new ServerConfigurationProvider(); };

    // act && assert
    expect(configuration).toThrowError('PROJECT_ID has not been set or is set to an empty string');
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
    process.env['SURVEYS'] = surveys;
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
    expect(sut.Roles).toEqual(rolesList);
    expect(sut.BlaiseApiUrl).toEqual(`http://${blaiseApiUrl}`);
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
    expect(sut.SessionTimeout).toEqual(sut.DefaultSessionTimeout);
  });

  it.each([undefined, '', '_ROLES'])('should return the roles listed in the role config if roles is empty or does not exist', (value) => {
    // arrange
    process.env['ROLES'] = value;

    // act
    const sut = new ServerConfigurationProvider();

    // assert
    expect(sut.Roles).toEqual(['SVT Supervisor', 'SVT Editor', 'FRS Research', 'Survey Support']);
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

  it.each(['SVT Supervisor', 'SVT Editor'])('should return the expected surveys for the SVT role', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveysForRole(role);

    // assert
    expect(result).toEqual(['FRS']);
  });

  it.each(['SVT Supervisor', 'SVT Editor'])('should return the expected outcome configuration for SVT roles for FRS', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveyConfigForRole('FRS', role);

    // assert
    expect(result.Survey).toEqual('FRS');
    expect(result.Outcomes).toEqual([CaseOutcome.Completed, CaseOutcome.CompletedNudge, CaseOutcome.CompletedProxy]);
  });

  it.each(['SVT Supervisor', 'SVT Editor'])('should return the expected organisation configuration for SVT roles for FRS', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveyConfigForRole('FRS', role);

    // assert
    expect(result.Survey).toEqual('FRS');
    expect(result.Organisations).toEqual([Organisation.ONS]);
  });

  it.each(['FRS Research'])('should return the expected surveys for the FRS Research role', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveysForRole(role);

    // assert
    expect(result).toEqual(['FRS']);
  });

  it.each(['FRS Research'])('should return the expected outcome configuration for FRS Research role for FRS', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveyConfigForRole('FRS', role);

    // assert
    expect(result.Survey).toEqual('FRS');
    expect(result.Outcomes).toEqual([]);
  });

  it.each(['FRS Research'])('should return the expected organisation configuration for FRS Research role for FRS', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveyConfigForRole('FRS', role);

    // assert
    expect(result.Survey).toEqual('FRS');
    expect(result.Organisations).toEqual([]);
  });

  it.each(['Survey Support'])('should return the expected surveys for the Survey Support role', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveysForRole(role);

    // assert
    expect(result).toEqual(['FRS']);
  });

  it.each(['Survey Support'])('should return the expected outcome configuration for Survey Support role for FRS', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveyConfigForRole('FRS', role);

    // assert
    expect(result.Survey).toEqual('FRS');
    expect(result.Outcomes).toEqual([]);
  });

  it.each(['Survey Support'])('should return the expected organisation configuration for Survey Support role for FRS', (role) => {
    // arrange
    const sut = new ServerConfigurationProvider();

    // act
    const result = sut.getSurveyConfigForRole('FRS', role);

    // assert
    expect(result.Survey).toEqual('FRS');
    expect(result.Organisations).toEqual([]);
  });
});
