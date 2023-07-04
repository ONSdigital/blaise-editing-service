export interface Config {
  BlaiseApiUrl: string;
  BuildFolder:string;
  Port: number;
}

export default function getConfiguration(): Config {
  const {
    PORT,
    BLAISE_API_URL,
  } = process.env;

  return {
    BlaiseApiUrl: BLAISE_API_URL === undefined ? 'http://localhost:5011' : BLAISE_API_URL, // Rest Api url
    BuildFolder: '../build', // where ever the react built package is
    Port: PORT === undefined ? 5000 : +PORT, // the port that the express server runs on
  };
}
