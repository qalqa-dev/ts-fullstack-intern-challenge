import { useCatStore } from '@/stores/catStore';
import { useEffect } from 'react';

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const { validateUserToken } = useCatStore();
  useEffect(() => {
    validateUserToken();
  }, [validateUserToken]);
  return <>{children}</>;
};

export default MainWrapper;
