import { useCatStore } from '@/stores/catStore';
import { ROUTES } from '@/utils/routes';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';

const Auth = () => {
  const { userToken, loginUser, errorMessage } = useCatStore();

  const [inputLogin, setInputLogin] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [errorLogin, setErrorLogin] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');

  const handleLoginInput = (event: React.FormEvent<HTMLInputElement>) => {
    setInputLogin(event.currentTarget.value);
  };

  const handlePasswordInput = (event: React.FormEvent<HTMLInputElement>) => {
    setInputPassword(event.currentTarget.value);
  };

  const handleAuth = () => {
    if (inputLogin === '') {
      setErrorLogin('Вы не ввели логин!');
      return;
    }
    if (inputPassword === '') {
      setErrorPassword('Вы не ввели пароль!');
      return;
    }
    loginUser(inputLogin, inputPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {userToken ? (
          <>
            <h2 className={styles.title}>Вы авторизованы!</h2>
            <Link to={ROUTES.HOME} className={styles.button}>
              На главную
            </Link>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Авторизация</h2>
            <div>
              <label className={styles.label} htmlFor="login">
                Введите ваш логин
              </label>
              <input
                value={inputLogin}
                onInput={(e) => handleLoginInput(e)}
                className={styles.input}
                id="login"
                type="text"
              />
              {errorLogin && <p className={styles.error}>{errorLogin}</p>}
            </div>
            <div>
              <label className={styles.label} htmlFor="passwords">
                Введите ваш пароль
              </label>
              <input
                value={inputPassword}
                onInput={(e) => handlePasswordInput(e)}
                className={styles.input}
                id="password"
                type="text"
              />
              {errorPassword && <p className={styles.error}>{errorPassword}</p>}
            </div>
            <button onClick={() => handleAuth()} className={styles.button}>
              Подтвердить
            </button>
          </>
        )}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Auth;
