import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from "../utils/api";

function App() {
    const [isEditAvatarPopupOpen, setEditAvatarPopup] = React.useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopup] = React.useState(false);
    const [isAddPlacePopupOpen, setEditPlacePopup] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);

    React.useEffect(() => {
        api.getProfileInfo()
        .then(res => {
            setCurrentUser(res);
          })
          .catch((err) => console.log(err));
        },[]);

    React.useEffect(() => {
        api.getInitialCards().then(res => {
            setCards(res);
            })
            .catch((err) => console.log(err));
        },[]);

    function handleEditAvatarClick() {
        setEditAvatarPopup(true);
    }
    
    function handleEditProfileClick() {
        setEditProfilePopup(true);
    } 

    function handleAddPlaceClick() {
        setEditPlacePopup(true);
    } 

    function handleCardClick(props) {
        setSelectedCard(props);
    } 

    function closeAllPopups() {
        setEditAvatarPopup(false);
        setEditProfilePopup(false);
        setEditPlacePopup(false);
        setSelectedCard(null);
    }

    function handleUpdateUser(user) {
        api.setProfileInfo(user)
        .then(res => {
            setCurrentUser(res);
            closeAllPopups();
          })
          .catch((err) => console.log(err));
    }
    
    function handleUpdateAvatar(user) {
        api.setProfileAvatar(user)
        .then(res => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch((err) => console.log(err));
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card)
        .then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id))
        })
        .catch((err) => console.log(err));
    }

    function handleAddCard(card) {
        api.addCard(card)
        .then(res => {
            setCards([res, ...cards])
            closeAllPopups();
        })
        .catch((err) => console.log(err));
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="root">
            <div className="page">
                <Header />
                <Main onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                />
                <Footer />
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddCard} />
                {/* <PopupWithForm title="Вы уверены?" name="popup-delete" button="да" /> */}
                <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
            </div>    
        </div>
    </CurrentUserContext.Provider>
  );
}

export default App;