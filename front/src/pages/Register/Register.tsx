import { useCatStore } from '@/stores/catStore';
import { ROUTES } from '@/utils/routes';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

const Auth = () => {
  const { userToken, registerUser } = useCatStore();

  const [inputLogin, setInputLogin] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [errorLogin, setErrorLogin] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const navigate = useNavigate();

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
    registerUser(inputLogin, inputPassword);
    navigate(ROUTES.HOME);
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
            <h2 className={styles.title}>Регистрация</h2>
            <div>
              <label className={styles.label} htmlFor="login">
                Придумайте логин
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
                Придумайте пароль
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
      </div>
    </div>
  );
};

export default Auth;
