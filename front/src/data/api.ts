import { Cat, IBreed } from '@/model/breed';

const api = 'https://api.thecatapi.com/v1';
const backendApi = 'http://localhost:3000';

export const getCatsBreeds = async (
  apiKey: string,
  page: number,
  limit: number,
): Promise<IBreed[]> => {
  const url = `${api}/breeds?limit=${limit}&page=${page}`;
  try {
    console.log(apiKey);
    const response = await fetch(url, {
      headers: { 'x-api-key': apiKey },
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCatsByBreed = async (
  breed: string,
  picturesPerPage: number,
  userApiKey: string,
): Promise<Cat[]> => {
  const url = `${api}/images/search?limit=${picturesPerPage}&breed_ids=${breed}&api_key=${userApiKey}`;
  try {
    const response = await fetch(url, {
      headers: { 'x-api-key': userApiKey },
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addNewUser = async (login: string, password: string) => {
  const url = `${backendApi}/users/register`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const authToken = response.headers.get('X-Auth-Token');
    const apiKey = await response.json().then((data) => data.api_key);
    return { apiKey, authToken };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserToken = async (login: string, password: string) => {
  const url = `${backendApi}/users/login`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
