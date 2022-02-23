import '../styles/sign.css';
import React from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleChande(evt) {
    if (evt.target.name === 'email') {
      setEmail(evt.target.value);
    } else if (evt.target.name === 'password') {
      setPassword(evt.target.value);
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!email || !password) {
      return;
    }
    onLogin(email, password);
  }

  return (
    <section className="login">
      <div className="sign">
        <p className="sign__welcome">Вход</p>
        <form className="sign__form" onSubmit={handleSubmit}>
          <input
            className="sign__input"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleChande}
          />
          <input
            className="sign__input"
            id="password"
            name="password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={handleChande}
            autoComplete="off"
            required
          />
          <button type="submit" className="sign__button">
            Войти
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
