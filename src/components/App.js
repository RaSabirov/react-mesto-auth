import React from 'react';
import { Route, Switch, Redirect, history } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import { useHistory } from 'react-router-dom';
import * as ApiAuth from '../utils/ApiAuth';

function App() {
  // =================================================
  // ===== СТЕЙТЫ
  // =================================================
  // Переменные состояния, отвечающие за видимость попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = React.useState(false);

  // Переменная состояния, отвечающая за выбранную карточку(при клике на картинку)
  const [selectedCard, setSelectedCard] = React.useState({});
  // Стейт, отвечающий за данные текущего пользователя
  const [currentUser, setCurrentUser] = React.useState({});
  // Переменная состояния отвечающая за состояние cards
  const [cards, setCards] = React.useState([]);
  // Стейт, отвечающий за подготовку к удалении карточки. Передаем карту в api и при открытии попапа
  const [toDeleteCard, setToDeleteCard] = React.useState({});

  // Стейты прелоудеров загрузки
  const [isLoadingAddPopup, setIsLoadingAddPopup] = React.useState(false);
  const [isLoadingEditPopup, setIsLoadingEditPopup] = React.useState(false);
  const [isLoadingAvatarPopup, setIsLoadingAvatarPopup] = React.useState(false);
  const [isLoadingDeletePopup, setIsLoadingDeletePopup] = React.useState(false);

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [regSuccess, setRegSuccess] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const history = useHistory();
  // =================================================
  // ===== РАБОТА С API ЗАПРОСАМИ
  // =================================================
  // Эффект который будет совершать запрос в API за отображением карточек
  React.useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => alert(`Ошибка загрузки данных с сервера: ${err}`));
  }, []);

  // Отображаем информацию о пользователе из API
  React.useEffect(() => {
    api
      .getUserData()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => alert('Ошибка загрузки данных с сервера:', err));
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => alert('Ошибка лайка/дизлайка карточки:', err));
  }

  function handleDeleteCardSubmit() {
    setIsLoadingDeletePopup(true);
    api
      .deleteCard(toDeleteCard._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== toDeleteCard._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => alert('Ошибка удаления карточки:', err))
      .finally(() => {
        setIsLoadingDeletePopup(false);
      });
  }

  function handleUpdateUser(data) {
    setIsLoadingEditPopup(true);
    api
      .setUserInfo(data.name, data.about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => alert('Ошибка загрузки данных пользователя:', err))
      .finally(() => {
        setIsLoadingEditPopup(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoadingAvatarPopup(true);
    api
      .setUserAvatar(data.avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => alert('Ошибка обновления аватара:', err))
      .finally(() => {
        setIsLoadingAvatarPopup(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoadingAddPopup(true);
    api
      .addCard(data.name, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => alert('Ошибка добавления карточки:', err))
      .finally(() => {
        setIsLoadingAddPopup(false);
      });
  }

  function handleRegister(email, password) {
    ApiAuth.register(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setRegSuccess(true);
          setIsInfoTooltipOpen(true);
          history.push('/sign-in');
        }
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setRegSuccess(false);
        return console.log(err);
      });
  }

  function handleAuthorization(email, password) {
    ApiAuth.authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
          setUserEmail(email);
          history.push('/');
        }
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setRegSuccess(false);
        return console.log(err);
      });
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      ApiAuth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.data.email);
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleLogOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUserEmail('');
    history.push('/sign-in');
  }

  React.useEffect(() => {
    tokenCheck();
  }, [loggedIn]);

  // =================================================
  // ===== Функции-обработчики для открытия попапов
  // =================================================
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleCardDeleteClick(toDeleteCard) {
    // Отмечаем выбранную id карточки
    setToDeleteCard(toDeleteCard);
    // Передаем открытие попапа
    setIsDeleteCardPopupOpen(true);
  }
  // =================================================
  // ===== Функция-обработчик для закрытия всех попапов
  // =================================================
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
  }

  // =================================================
  // ===== РЕНДЕР КОМПОНЕНТОВ
  // =================================================
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header userEmail={userEmail} onLogOut={handleLogOut} />
      <Switch>
        <Route path="/sign-up">
          <Register onRegister={handleRegister} />
        </Route>
        <Route path="/sign-in">
          <Login onLogin={handleAuthorization} />
        </Route>
        <ProtectedRoute
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDeleteClick}
          cards={cards}
          exact
          path="/"
          component={Main}
          loggedIn={loggedIn}
        />

        <Route exact path="/">
          {!loggedIn && <Redirect to="/sign-in" />}
        </Route>
        <Footer />
      </Switch>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoadingEditPopup}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoadingAvatarPopup}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isLoading={isLoadingAddPopup}
      />

      <DeleteCardPopup
        isOpen={isDeleteCardPopupOpen}
        onClose={closeAllPopups}
        onDeleteCard={handleDeleteCardSubmit}
        isLoading={isLoadingDeletePopup}
      />

      <ImagePopup
        namePopup="image"
        isOpen={!!selectedCard.name && !!selectedCard.link}
        card={selectedCard}
        onClose={closeAllPopups}
        isImagePopup={selectedCard}
      />
      <InfoTooltip success={regSuccess} isOpen={isInfoTooltipOpen} onClose={closeAllPopups} namePopup="infoTool" />
    </CurrentUserContext.Provider>
  );
}

export default App;
