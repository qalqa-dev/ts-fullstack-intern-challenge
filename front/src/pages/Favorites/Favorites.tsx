import BreedCard from '@/components/BreedCard/BreedCard';
import { useCatStore } from '@/stores/catStore';
import NoAuthPlaceholder from 'components/NoAuthPlaceholder/NoAuthPlaceholder';
import { useEffect } from 'react';
import styles from './Favorites.module.scss';

const Favorites = () => {
  const { favorites, getAllFavorites, userToken } = useCatStore();

  useEffect(() => {
    getAllFavorites();
  }, [getAllFavorites]);

  return (
    <main className={styles.container}>
      {!userToken ? (
        <NoAuthPlaceholder />
      ) : (
        <>
          <h2>Ваши любимые котики {'<3'} </h2>
          <ul className={styles.list}>
            {favorites.map((favorite) => (
              <BreedCard key={favorite.id} cat={favorite} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
};

export default Favorites;
