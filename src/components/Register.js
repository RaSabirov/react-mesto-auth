import '../styles/sign.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
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
    onRegister(email, password);
  }

  return (
    <section className="register">
      <div className="sign">
        <p className="sign__welcome ">Регистрация</p>
        <form className="sign__form" onSubmit={handleSubmit}>
          <input
            className="sign__input"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChande}
            required
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
            Зарегистрироваться
          </button>
        </form>
        <div className="sign__signin">
          <Link to="/sign-in" className="sign__login-link">
            Уже зарегистрированы? Войти
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Register;
