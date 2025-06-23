import { useCatStore } from '@/stores/catStore';
import BreedCard from 'components/BreedCard/BreedCard';
import NoAuthPlaceholder from 'components/NoAuthPlaceholder/NoAuthPlaceholder';
import styles from './Favorites.module.scss';

const Favorites = () => {
  const { favorites, userToken } = useCatStore();

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
