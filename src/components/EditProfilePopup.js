import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  // Подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');

  // Сбрасываем значения инпутов при повторном открытии попапа
  React.useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, isOpen]);

  // Обработчик изменения инпута обновляет стейт
  function handleChangeName(evt) {
    setName(evt.target.value);
  }
  function handleChangeDescription(evt) {
    setAbout(evt.target.value);
  }

  function handleSubmit(evt) {
    // Запрещаем браузеру переходить по адресу формы
    evt.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about,
    });
  }

  return (
    <PopupWithForm /* Форма редактирования профиля */
      namePopup="profile-edit"
      title="Редактировать профиль"
      formName="form-edit-profile"
      buttonName="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      loadingTextBtn="Сохранение..."
    >
      <div className="popup__input-container">
        <input
          type="text"
          placeholder="Название"
          className="popup__input popup__input_type_title"
          name="firstName"
          minLength="2"
          maxLength="30"
          required
          autoComplete="off"
          id="title-input"
          value={name ?? ''}
          onChange={handleChangeName}
        />
        <span className="popup__input-error" id="title-input-error"></span>
      </div>
      <div className="popup__input-container">
        <input
          type="text"
          placeholder="Введите описание"
          className="popup__input popup__input_type_job"
          name="aboutMe"
          required
          autoComplete="off"
          id="job-input"
          value={about ?? ''}
          onChange={handleChangeDescription}
        />
        <span className="popup__input-error" id="job-input-error"></span>
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
