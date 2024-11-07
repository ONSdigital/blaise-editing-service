import axios from 'axios';
import notFound from '../../server/helpers/axiosHelper';

export default async function getDataFromNode<T>(url: string, notFoundError: string): Promise<T> {
  try {
    console.log(`getDataFromNode - start ${url}`);
    const response = await axios.get(url);
    console.log(`getDataFromNode - response ${response.data}`);
    return response.data;
  } catch (error) {
    console.log(`getDataFromNode - error ${error}`);
    if (notFound(error)) {
      throw new Error(notFoundError);
    }
    throw new Error('Unable to complete request, please try again in a few minutes');
  }
}
