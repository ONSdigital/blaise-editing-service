export interface Config {
  BlaiseApiUrl: string;
  BuildFolder:string;
  Port: number;
}

export function getConfiguration(): Config {
  const {
    PORT,
    BLAISE_API_URL,
  } = process.env;

  console.debug('Api url', BLAISE_API_URL);
  console.debug('Port', PORT);

  return {
    BlaiseApiUrl: BLAISE_API_URL === undefined ? 'http://localhost:5011' : BLAISE_API_URL, // Rest Api url
    BuildFolder: '../build', // where ever the react built package is
    Port: PORT === undefined ? 5000 : +PORT, // the port that the express server runs on
  };
}
