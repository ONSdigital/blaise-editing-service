import { CaseOutcome, Organisation } from "blaise-api-node-client";

import ServerConfigurationProvider from "./serverConfigurationProvider.js";

const emptyEnv = process.env;
const blaiseApiUrl = "rest.api.blaise.com";
const buildFolder = "../client";
const port = 5000;
const serverPark = "gusty";
const externalWebUrl = "cati.blaise.com";
const projectId = "ons-blaise-v2-dev";
const urlDomain = "localhost";
const sessionSecret = "richlikesricecakes";
const rolesList = ["SVT Supervisor", "SVT Editor", "FRS Researcher", "Survey Support"];

describe("Configuration file tests", () => {
  beforeEach(() => {
    process.env["BLAISE_API_URL"] = blaiseApiUrl;
    process.env["SERVER_PARK"] = serverPark;
    process.env["CATI_URL"] = externalWebUrl;
    process.env["PROJECT_ID"] = projectId;
    process.env["URL_DOMAIN"] = urlDomain;
    process.env["SESSION_SECRET"] = sessionSecret;
  });

  afterEach(() => {
    process.env = { ...emptyEnv };
  });

  it("should populate the properties with values from environement variables when they exist in the environment variables", () => {
    const sut = new ServerConfigurationProvider();

    expect(sut.BlaiseApiUrl).toEqual(`http://${blaiseApiUrl}`);
    expect(sut.BuildFolder).toEqual(buildFolder);
    expect(sut.Port).toEqual(port);
    expect(sut.ServerPark).toEqual(serverPark);
    expect(sut.ProjectId).toEqual(projectId);
    expect(sut.UrlDomain).toEqual(urlDomain);
  });

  it.each([undefined, "", " ", "  "])(
    "should throw an error if the BLAISE_API_URL is empty or does not exist",
    (value) => {
      process.env["BLAISE_API_URL"] = value;

      const configuration = () => {
        new ServerConfigurationProvider();
      };

      expect(configuration).toThrowError(
        "BLAISE_API_URL has not been set or is set to an empty string",
      );
    },
  );

  it.each([undefined, "", " ", "  "])(
    "should use the default port if the PORT is empty or does not exist",
    (value) => {
      process.env["PORT"] = value;

      const sut = new ServerConfigurationProvider();

      expect(sut.Port).toEqual(5000);
    },
  );

  it.each(["NotNumber", "eight"])("should throw an error if the PORT is not number", (value) => {
    process.env["PORT"] = value;

    const configuration = () => {
      new ServerConfigurationProvider();
    };

    expect(configuration).toThrowError(TypeError);
    expect(configuration).toThrowError("PORT is not set to a valid number");
  });

  it.each([undefined, "", "  ", "   "])(
    "should throw an error if SERVER_PARK is empty or does not exist",
    (value) => {
      process.env["SERVER_PARK"] = value;

      const configuration = () => {
        new ServerConfigurationProvider();
      };

      expect(configuration).toThrowError(
        "SERVER_PARK has not been set or is set to an empty string",
      );
    },
  );
});

describe("Authentication file tests", () => {
  beforeEach(() => {
    process.env["SESSION_SECRET"] = sessionSecret;
    process.env["BLAISE_API_URL"] = blaiseApiUrl;
    process.env["SERVER_PARK"] = serverPark;
    process.env["CATI_URL"] = externalWebUrl;
    process.env["PROJECT_ID"] = projectId;
    process.env["URL_DOMAIN"] = urlDomain;
  });

  afterEach(() => {
    process.env = { ...emptyEnv };
  });

  it("should populate the authentication properties with values from environement variables when they exist in the environment variables", () => {
    const sut = new ServerConfigurationProvider();

    expect(sut.SessionSecret).toEqual(sessionSecret);
    expect(sut.SessionTimeout).toEqual("12h");
    expect(sut.Roles).toEqual(rolesList);
    expect(sut.BlaiseApiUrl).toEqual(`http://${blaiseApiUrl}`);
    expect(sut.TokenIssuer).toEqual(projectId);
  });

  it("should use VM_EXTERNAL_WEB_URL when CATI_URL is not set", () => {
    process.env["CATI_URL"] = "";
    process.env["VM_EXTERNAL_WEB_URL"] = externalWebUrl;

    const sut = new ServerConfigurationProvider();

    expect(sut.ExternalWebUrl).toEqual(externalWebUrl);
  });

  it.each([undefined, "", " ", "_SESSION_SECRET"])(
    "should throw an error if SESSION_SECRET is empty or does not exist",
    (value) => {
      process.env["SESSION_SECRET"] = value;

      const configuration = () => {
        new ServerConfigurationProvider();
      };

      expect(configuration).toThrowError(
        "SESSION_SECRET has not been set or is set to an empty string",
      );
    },
  );

  it.each([undefined, "", " ", "  ", "24h"])(
    'should always be "12h" regardless of SESSION_TIMEOUT env value',
    (value) => {
      process.env["SESSION_TIMEOUT"] = value;

      const sut = new ServerConfigurationProvider();

      expect(sut.SessionTimeout).toEqual(sut.DefaultSessionTimeout);
    },
  );

  it.each([undefined, "", "_ROLES", "SVT Supervisor"])(
    "should always return the hardcoded allowlist regardless of ROLES env value",
    (value) => {
      process.env["ROLES"] = value;

      const sut = new ServerConfigurationProvider();

      expect(sut.Roles).toEqual(rolesList);
    },
  );

  it.each([undefined, "", "  ", "   "])(
    "should throw an error if BLAISE_API_URL is empty or does not exist",
    (value) => {
      process.env["BLAISE_API_URL"] = value;

      const configuration = () => {
        new ServerConfigurationProvider();
      };

      expect(configuration).toThrowError(
        "BLAISE_API_URL has not been set or is set to an empty string",
      );
    },
  );

  it.each([undefined, "", "  ", "   "])(
    "should throw an error if CATI_URL is empty or does not exist",
    (value) => {
      process.env["CATI_URL"] = value;

      const configuration = () => {
        new ServerConfigurationProvider();
      };

      expect(configuration).toThrowError("CATI_URL has not been set or is set to an empty string");
    },
  );

  it.each([undefined, "", "_PROJECT_ID"])(
    "should throw an error if PROJECT_ID is empty or does not exist",
    (value) => {
      process.env["PROJECT_ID"] = value;

      const configuration = () => {
        new ServerConfigurationProvider();
      };

      expect(configuration).toThrowError(
        "PROJECT_ID has not been set or is set to an empty string",
      );
    },
  );

  it.each(["SVT Supervisor", "SVT Editor"])(
    "should return the expected surveys for the SVT role",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveysForRole(role);

      expect(result).toEqual(["FRS"]);
    },
  );

  it.each(["SVT Supervisor", "SVT Editor"])(
    "should return the expected outcome configuration for SVT roles for FRS",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveyConfigForRole("FRS", role);

      expect(result.Survey).toEqual("FRS");
      expect(result.Outcomes).toEqual([
        CaseOutcome.Completed,
        CaseOutcome.CompletedNudge,
        CaseOutcome.CompletedProxy,
      ]);
    },
  );

  it.each(["SVT Supervisor", "SVT Editor"])(
    "should return the expected organisation configuration for SVT roles for FRS",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveyConfigForRole("FRS", role);

      expect(result.Survey).toEqual("FRS");
      expect(result.Organisations).toEqual([Organisation.ONS]);
    },
  );

  it.each(["FRS Researcher"])(
    "should return the expected surveys for the FRS Researcher role",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveysForRole(role);

      expect(result).toEqual(["FRS"]);
    },
  );

  it.each(["FRS Researcher"])(
    "should return the expected outcome configuration for FRS Researcher role for FRS",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveyConfigForRole("FRS", role);

      expect(result.Survey).toEqual("FRS");
      expect(result.Outcomes).toEqual([]);
    },
  );

  it.each(["FRS Researcher"])(
    "should return the expected organisation configuration for FRS Researcher role for FRS",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveyConfigForRole("FRS", role);

      expect(result.Survey).toEqual("FRS");
      expect(result.Organisations).toEqual([]);
    },
  );

  it.each(["Survey Support"])(
    "should return the expected surveys for the Survey Support role",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveysForRole(role);

      expect(result).toEqual(["FRS"]);
    },
  );

  it.each(["Survey Support"])(
    "should return the expected outcome configuration for Survey Support role for FRS",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveyConfigForRole("FRS", role);

      expect(result.Survey).toEqual("FRS");
      expect(result.Outcomes).toEqual([]);
    },
  );

  it.each(["Survey Support"])(
    "should return the expected organisation configuration for Survey Support role for FRS",
    (role) => {
      const sut = new ServerConfigurationProvider();

      const result = sut.getSurveyConfigForRole("FRS", role);

      expect(result.Survey).toEqual("FRS");
      expect(result.Organisations).toEqual([]);
    },
  );
});
