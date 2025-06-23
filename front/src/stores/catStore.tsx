import { addNewUser, getCatsBreeds, getCatsByBreed } from '@/data/api';
import { CatStore } from '@/model/catStore';
import { create } from 'zustand';

const FAVORITES_STORAGE_KEY = 'cat_favorites';
const CAT_API_KEY_STORAGE_KEY = 'cat_api_key';
const USER_TOKEN_KEY = 'user_token';

export const useCatStore = create<CatStore>((set, get) => ({
  breeds: [],
  cats: [],
  favorites: JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]'),
  isLoadingMain: false,
  isLoadingBreed: false,
  hasMore: true,
  error: null,
  currentPage: 0,
  picturesPerPage: 10,
  catApiKey: localStorage.getItem(CAT_API_KEY_STORAGE_KEY) || '',
  userToken:
    import.meta.env.VITE_API_KEY || localStorage.getItem(USER_TOKEN_KEY) || '',

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
    const { favorites } = get();
    if (!favorites.find((favorite) => favorite.id === cat.id)) {
      const updatedFavorites = [...favorites, cat];
      set({ favorites: updatedFavorites });
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites),
      );
    }
  },

  removeFromFavorites: (catId) => {
    const { favorites } = get();
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.id !== catId,
    );
    set({ favorites: updatedFavorites });
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updatedFavorites),
    );
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
  },
}));
