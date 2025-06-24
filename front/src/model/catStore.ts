import { Cat, IBreed } from './breed';

export interface CatStore {
  breeds: IBreed[];
  cats: Cat[];
  favorites: Cat[];
  isLoadingMain: boolean;
  isLoadingBreed: boolean;
  hasMore: boolean;
  error: Error | null | unknown;
  errorMessage: string;
  currentPage: number;
  picturesPerPage: number;
  userToken: string;
  catApiKey: string;
  fetchBreeds: () => Promise<void>;
  fetchCatsByBreed: (breed: string) => void;
  resetCats: () => void;
  addToFavorites: (cat: Cat) => void;
  removeFromFavorites: (catId: string) => void;
  isFavorite: (catId: string) => boolean;
  registerUser: (userLogin: string, userPassword: string) => Promise<void>;
  loginUser: (userLogin: string, userPassword: string) => Promise<void>;
  userLogout: () => void;
  getAllFavorites: () => void;
  validateUserToken: () => void;
}
