import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleLogin = async () => {
    setLoginError('');
    if (!username) {
      setUsernameError(true);
      setLoginError('Введите имя пользователя');
      return;
    }
    if (!password) {
      setPasswordError(true);
      setLoginError('Введите пароль');
      return;
    }
    try {
      await login(username, password);
      dispatch({ type: 'setUser', username });
      navigate('/rounds');
    } catch (err: any) {
      if (err.status === 401) {
        setLoginError('Неверная комбинация имени пользователя и пароля');
      } else {
        setLoginError(err.message || 'Ошибка входа');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>TheLastOfGuss Game</h2>

      <div className="form-group">
        <label>Имя пользователя:</label>
        <input value={username} onChange={e => {
          setUsername(e.target.value);
          if (usernameError) setUsernameError(false);
        }} className={usernameError ? 'error' : ''} />
      </div>

      <div className="form-group">
        <label>Пароль:</label>
        <input type="password" value={password} onChange={e => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError(false);
        }} className={passwordError ? 'error' : ''} />
      </div>
      <button onClick={handleLogin} className='guss-btn'>Войти</button>
      {<div className="error error-text">{loginError || '\u00A0'}</div>}
    </div>
  );
}
