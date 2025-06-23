import {
  addNewFavorite,
  addNewUser,
  deleteFavorite,
  fetchUserToken,
  getCatById,
  getCatsBreeds,
  getCatsByBreed,
  getFavorites,
} from '@/data/api';
import { CatStore } from '@/model/catStore';
import { ROUTES } from '@/utils/routes';
import { create } from 'zustand';

const CAT_API_KEY_STORAGE_KEY = 'cat_api_key';
const USER_TOKEN_KEY = 'user_token';

export const useCatStore = create<CatStore>((set, get) => ({
  breeds: [],
  cats: [],
  favorites: [],
  isLoadingMain: false,
  isLoadingBreed: false,
  hasMore: true,
  error: null,
  errorMessage: '',
  currentPage: 0,
  picturesPerPage: 10,
  catApiKey: localStorage.getItem(CAT_API_KEY_STORAGE_KEY) || '',
  userToken:
    import.meta.env.VITE_API_KEY || localStorage.getItem(USER_TOKEN_KEY) || '',

  init: () => {
    const { userToken, getAllFavorites } = get();
    if (userToken) {
      getAllFavorites();
    }
  },

  fetchBreeds: async () => {
    const { catApiKey, picturesPerPage, currentPage, breeds, hasMore } = get();
    if (!catApiKey) {
      return;
    }
    try {
      if (hasMore) {
        set({ isLoadingMain: true, error: null });
        const newBreeds = await getCatsBreeds(
          catApiKey,
          currentPage,
          picturesPerPage,
        );

        set({ currentPage: currentPage + 1 });
        set({
          breeds: [...breeds, ...newBreeds],
          currentPage: currentPage + 1,
          isLoadingMain: false,
        });
        if (newBreeds.length < picturesPerPage) {
          set({ hasMore: false, isLoadingMain: false });
        }
      }
    } catch (error: Error | unknown) {
      set({ error, isLoadingMain: false });
    }
  },

  fetchCatsByBreed: async (breed) => {
    const { picturesPerPage, catApiKey } = get();
    try {
      set({ isLoadingBreed: true, error: null });
      const cats = await getCatsByBreed(breed, picturesPerPage, catApiKey);
      set({ cats: cats || [], isLoadingBreed: false });
    } catch (error: Error | unknown) {
      set({ error, isLoadingBreed: false });
    }
  },

  resetCats: () => {
    set({
      cats: [],
    });
  },

  addToFavorites: (cat) => {
    addNewFavorite(cat.id, get().userToken);
    set({
      favorites: [...get().favorites, cat],
    });
  },

  removeFromFavorites: (catId) => {
    deleteFavorite(catId, get().userToken);
    set({
      favorites: get().favorites.filter((cat) => cat.id !== catId),
    });
  },

  getAllFavorites: async () => {
    const { userToken } = get();
    if (!userToken) return;

    try {
      const favoritesData = await getFavorites(userToken);

      const cats = await Promise.all(
        favoritesData.data.map(async (item: { cat_id: string; id: string }) => {
          const catDetails = await getCatById(item.cat_id);
          return { ...catDetails, favoriteId: item.id };
        }),
      );

      const validCats = cats.filter((cat) => cat !== null);

      set({ favorites: validCats });
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error);
      set({ favorites: [] });
    }
  },

  isFavorite: (catId) =>
    get().favorites.some((favorite) => favorite.id === catId),

  registerUser: async (userLogin: string, userPassword: string) => {
    const response = await addNewUser(userLogin, userPassword);
    if (response === null) {
      return;
    }
    const { apiKey: catApiKey, authToken: userToken } = response;
    if (!userToken) {
      return;
    }
    set({ userToken, catApiKey });
    localStorage.setItem(USER_TOKEN_KEY, userToken);
    localStorage.setItem(CAT_API_KEY_STORAGE_KEY, catApiKey);
    document.location.href = ROUTES.HOME;
  },

  loginUser: async (userLogin: string, userPassword: string) => {
    const response = await fetchUserToken(userLogin, userPassword);
    if (response === null) {
      set({
        errorMessage: 'Неправильный логин или пароль',
      });
      return;
    }
    const { apiKey: catApiKey, authToken: userToken } = response;
    if (!userToken) {
      return;
    }
    set({ userToken });
    set({
      errorMessage: 'Вы успешно авторизовались!',
    });
    localStorage.setItem(USER_TOKEN_KEY, userToken);
    localStorage.setItem(CAT_API_KEY_STORAGE_KEY, catApiKey);
    document.location.href = ROUTES.HOME;
  },

  userLogout: () => {
    set({ userToken: '' });
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(CAT_API_KEY_STORAGE_KEY);
  },
}));
