import { IBreed } from '@/model/breed';
import NotFound from '@/pages/NotFound/NotFound';
import { useCatStore } from '@/stores/catStore';
import BreedCard from 'components/BreedCard/BreedCard';
import Skeleton from 'components/Skeleton/Skeleton';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Breed.module.scss';

const Breed = () => {
  const location = useLocation();
  const state = location.state as { breed: IBreed };

  const { cats, resetCats, fetchCatsByBreed, isLoadingBreed, getAllFavorites } =
    useCatStore();

  useEffect(() => {
    const fetchData = async () => {
      resetCats();
      if (state.breed.id) {
        await fetchCatsByBreed(state.breed.id);
      }
    };
    fetchData();
    getAllFavorites();
  }, [state.breed.id, fetchCatsByBreed, getAllFavorites]);

  if (!state) return <NotFound />;

  return (
    <main className={styles.container}>
      <div>
        <h2>Коты породы {state?.breed.name} </h2>
        <ul className={styles.list}>
          {isLoadingBreed ? (
            <Skeleton />
          ) : (
            cats.map((cat) => <BreedCard key={cat.id} cat={cat} />)
          )}
        </ul>
      </div>
    </main>
  );
};

export default Breed;
