# KODA.md — доработка проекта VK-Маруся

> **VK Маруся** — это веб-приложение для поиска и оценки фильмов, созданное на основе Vue 3 с использованием шаблона Vite. Проект реализует полный цикл работы пользователя с фильмами: просмотр случайных рекомендаций, топ-рейтинга, фильтрацию по жанрам, авторизацию и управление избранным. *Требуется* провести рефакторинг проекта - изменить верстку элементов нтерфейса в соответствии с [Макетом приложения в Figma](figma.com/design/8FW6Yt3ztcoYATQhqiy4qK/Макет-VK-Маруся-для-диплома-Vue%2FReact?node-id=0-1&node-type=canvas), и исправить ошибки в функционале приложения
>
> ## Правила проекта
>
> - Строгая типизация Typescript
> - Запрещено исползовать scoped стили в файлах `*.vue` - в проекте используются только глобально подключеный файл `src/assets/scss/style.scss` и связанные с ним файлы стилей из папки `src/assets/scss`
> - В html разметке и стилях **обязательно** использование БЭМ
> - 

## Что нужно сделать

### Оптимизация SCSS

Изучив папку `src/assets/scss` создать в файле `src/assets/scss/base/_variables.scss` переменные для цветов, используемых в проекте. Заменить этими переменными все цвета в scss файлах

### Приведение верстки в соответствие с исходным  HTML макетом

> Сейчас страницы верстка страниц и отдельных элементов сильно отличается от исходного html шаблона проекта. Ниже приведена правильная разметка для всех элементов.
>
> #### Header
>
> ```html
> <header class="header">
>   <div class="container">
>     <div class="header__wrapper">
>         <a class="header__logo" href="index.html">
>           <img class="header__logo-img" src="img/logo.png" alt="Логотип">
>         </a>
>   
>         <ul class="header__list">
>           <li class="header__item">
>             <a class="header__link" href="index.html">
>             <span class="header__link-text">
>               Главная
>             </span>
>           </a>
>           </li>
>           <li class="header__item">
>             <a class="header__link" href="genres.html">
>                 <svg class="header__link-icon" width="24" height="24">
>                     <use xlink:href="img/sprite.svg#icon-genres"></use>
>                 </svg>
>                 <span class="header__link-text">
>                     Жанры
>                 </span>
>           </a>
>           </li>
>           <li class="header__item">
>             <form action="#" class="header__search">
>             <label for="search" class="header__search-label">
>               <svg class="header__search-icon" width="24" height="24">
>                 <use xlink:href="img/sprite.svg#icon-search"></use>
>               </svg>
>               <input class="header__search-field"  type="search" name="search" id="search">
>             </label>
>             <button type="button" class="btn header__search-btn" aria-label="Открыть поиск">
>               <svg width="24" height="24" class="header__form-icon" aria-hidden="true">
>                 <use xlink:href="img/sprite.svg#icon-search"></use>
>               </svg>
>             </button>
>           </form>
>           </li>
>         </ul>
>   
>         <button class="header__bth" type="button">
>           <svg width="24" height="24" class="header__bth-icon" aria-hidden="true">
>             <use xlink:href="img/sprite.svg#icon-user"></use>
>           </svg>
>           <span class="header__bth-text">Войти</span>
>         </button>
>     </div>
>   </div>
> </header>
> ```

Если пользователь не залогинен, элемент header__bth-text отображает надпись "Войти" , а после авторихации эта надпись меняется на "Аккаунт"

#### Секция random-film

```html
<section class="random-film">
        <div class="container">
          <div class="random-film__wrapper">
            <h2 class="visually-hidden">
                Случайный фильм
            </h2>
            <div class="random-film__content">
                <ul class="random-film__content-top">
                <li class="random-film__content-top-item">
                    <div class="random-film__rating random-film__rating--green">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  
                            <use xlink:href="img/sprite.svg#icon-star"></use>
  
                        </svg>
                        <span class="random-film__rating-text">
                           рейтинг
                        </span>
                    </div>
                </li>
                <li class="random-film__content-top-item">
                    <span class="random-film__year">
                        год выхода
                    </span>
                </li>
                <li class="random-film__content-top-item">
                    <span class="random-film__genre">
                        жанр
                    </span>
                </li>
                <li class="random-film__content-top-item">
                    <span class="random__film__duration">
                        время
                    </span>
                </li> 
                </ul>
                <div class="random-film__content-body">
                    <h3 class="random-film__subtitle">
  
                            Название
  
                    </h3>
                    <p class="random-film__description">
                        описание
                    </p>
                </div>
                <div class="random-film__content-bottom">
                    <button class="btn btn-primary random-film__btn random-film__btn--trailer"  type="button">
                        Трейлер
                    </button>
                    <a class="btn btn-primary random-film__btn" href="film.html" >
                        О фильме
                    </a>
                    <button class="btn btn-primary btn-primary--icon random-film__btn" type="button">
                        <svg class="btn-primary__icon" width="16" height="16" viewBox="0 0 24 24"  aria-hidden="true">
                        <use xlink:href="img/sprite.svg#icon-heart"></use>
                        </svg>
                    </button>
                    <button class="btn btn-primary btn-primary--icon random-film__btn" type="button">
                        <svg class="btn-primary__icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                        <use xlink:href="img/sprite.svg#icon-reset"></use>
                        </svg>
                    </button>
                </div>
            </div> 
                <div class="random-film__image-wrapper">
                    <img class="random-film__image" src="img/index/cover.jpg" alt="Кадр из фильма">
                </div>
  
          </div>  
  
        </div>
  

</section>

```

#### Секция top-10

```html
<section class="top-10">
    <div class="container">
       <h2 class="top-10__title">
        Топ 10 фильмов
       </h2>
       <ol class="top-10__list">
        <li class="top-10__item">
            <a href="film.html" class="card top-10__card">
            
                <h3 class="visually-hidden">
                    Название
                </h3>
            
                <img src="" alt="Постер фильма" class="card__image">
            </a>
        </li>
    
       </ol> 
    </div>
</section>
```

#### Секция all-genres

```html
<section class="all-genres">
    <div class="container">
        <div class="all-genres__wrapper">
            <h2 class="all-genres__title">
                Жанры фильмов
            </h2>
            <ul class="all-genres__list">
                <li class="all-genres__item">
                    <a href="genre.html" class="card genre-card">
                        <div class="genre-card__top">
                            <img src="/images/genres/genre-1.png" alt="" class="genre-card__img">
                        </div>
                        <div class="genre-card__bottom">
                            <span class="genre-card__text">
                                genre
                            </span>
                        </div>
                    </a>
                </li>
            
            </ul>
        </div>
    </div>
</section>
```

Файлы изображений для жанров находятся в папке `public/images/genres`

#### Секция genre

```html
<section class="genre">
    <div class="container">
        <div class="genre__wrapper">
                <h2 class="genre__title">
                 жанр
                </h2>
            <ul class="genre__list">
                <li class="genre__item">
                    <a class="card film-card" href="film.html">
                      
                        <h3 class="visually-hidden">
                            название
                        </h3>
                      
                        <img class="film-card__image" src="g" alt="Постер фильма">
                    </a>
                </li>
              
            </ul>
            <button type="button" class="btn btn-primary genre__btn" id="GenreMore">
                Показать ещё
            </button>   
        </div>
    </div>
</section>
```

#### Секция film

```html
<section class="film">
    <div class="container">
      <div class="film__inner">
        <div class="film__content">
            <ul class="film__content-top">
                <li class="film__content-top-item">
                    <div class="film__rating film__rating--green">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        
                            <use xlink:href="img/sprite.svg#icon-star"></use>
                        
                        </svg>
                        <span class="film__rating-text">
                            значение
                        </span>
                    </div>
                </li>
                <li class="film__content-top-item">
                    <span class="film__year">
                        год
                    </span>
                </li>
                <li class="film__content-top-item">
                    <span class="film__genre">
                        значение
                    </span>
                </li>
                <li class="film__content-top-item">
                    <span class="random__film__duration">
                        значение
                    </span>
                </li> 
            </ul>
            <div class="film__content-body">
                <h1 class="film__title">
                    Название 
                </h1>
                <p class="film__description">
                Описание
                </p>
            </div>
            <div class="film__content-bottom">
                    <button class="btn btn-primary" type="button">
                        Трейлер
                    </button>
                
                    <button class="btn btn-primary btn-primary--icon" type="button">
                        <svg class="btn-primary__icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
                        <use xlink:href="img/sprite.svg#icon-heart"></use>
                        </svg>
                    </button>
                
                </div>
        </div>
        <div class="film__image-wrapper">
                    <img class="film__image" src="" alt="Кадр из фильма">
                </div>
        <div class="film__info">
            <h2 class="film__info-title">
               О фильме 
            </h2>
            <ul class="film__info-list">
                <li class="film__info-item">
                    <div class="film__info-item-left">
                        Язык оригинала
                    </div>
                    <div class="film__info-item-right">
                        значение 
                    </div>
                </li>
                <li class="film__info-item">
                    <div class="film__info-item-left">
                        Бюджет
                    </div>
                    <div class="film__info-item-right">
                        значение 
                    </div>
                </li>
                <li class="film__info-item">
                    <div class="film__info-item-left">
                        Выручка
                    </div>
                    <div class="film__info-item-right">
                        значение 
                    </div>
                </li>
                <li class="film__info-item">
                    <div class="film__info-item-left">
                        Режиссёр
                    </div>
                    <div class="film__info-item-right">
                       значение 
                    </div>
                </li>
                <li class="film__info-item">
                    <div class="film__info-item-left">
                       Продакшен 
                    </div>
                    <div class="film__info-item-right">
                       значение 
                    </div>
                </li>
                <li class="film__info-item">
                    <div class="film__info-item-left">
                        Награды
                    </div>
                    <div class="film__info-item-right">
                        значение 
                    </div>
                </li>
            </ul>
        </div>
      </div>  
    </div>
</section>
```

#### Секция account

```html
<section class=" account">
    <div class="container">
        <div class="account__wrapper">
            <h1 class="account__title">
                Мой аккаунт
            </h1>
            <div class="account__tab" id="accountTab">
                <div class="account__tab-nav">
                    <button class="account__tab-btn account__tab-btn--active" data-target-id="0">
                       <svg class="account__tab-icon" aria-hidden="true" width="24" height="24">
                         <use xlink:href="img/sprite.svg#icon-heart-solid"></use>
                       </svg> 
                       <span class="account__tab-btn-text">
                        Избранные фильмы
                       </span>
                   
                    </button>
                    <button class="account__tab-btn" data-target-id="1">
                        <svg class="account__tab-icon" aria-hidden="true" width="24" height="24">
                         <use xlink:href="img/sprite.svg#icon-user-solid"></use>
                       </svg> 
                       <span class="account__tab-btn-text">
                        Настройка аккаунта
                       </span>
                    </button>
                </div>
                <div class="account__tab-content">
                    <div class="account__tab-pane account__tab-pane--active" data-id="0">
                         <ul class="account__film-list">
                            <li class="account__film-item">
                            
                               <a class="film-card account__film-card" href="film.html">
                                <button type="button" class="account__film-delete" aria-label="Удалить из избранного">
                                    <svg width="13" height="13" class="account__film-delete-icon" aria-hidden="true">
                                      <use xlink:href="img/sprite.svg#icon-close-black"></use>
                                    </svg>
                                </button>
                                <h3 class="visually-hidden">
                                    название
                                </h3>
                    
                                <img class="film-card__image" src="img/top/card-1.png" alt="Постер фильма">
                                </a> 
                            </li>
                        
                         </ul>
                   
                    </div>
                    <div class="account__tab-pane" data-id="1">
                        <h2 class="visually-hidden">
                            Настройки аккаунта
                        </h2>
                        <ul class="account__user-list">
                            <li class="account__user-item">
                                <div class="account__user-list-marker" id="userMarker">
                                    КК
                                </div>
                                <div class="account__user-list-content">
                                   <span class="account__user-list-title">
                                    Имя Фамилия
                                   </span>
                                   <span class="account__user-list-data" id="userName">
                                    Константин Константинопольский
                                   </span> 
                                </div>
                            
                            </li>
                            <li class="account__user-item">
                                <div class="account__user-list-marker">
                                    <svg class="account__user-list-icon" aria-hidden="true" width="24" height="24">
                                      <use xlink:href="img/sprite.svg#icon-email"></use>
                                    </svg>
                                </div>
                                <div class="account__user-list-content">
                                   <span class="account__user-list-title">
                                    Электронная почта
                                   </span>
                                   <span class="account__user-list-data" id="userEmail">
                                    example@domain.com
                                   </span> 
                                </div>
                            </li>
                        </ul>
                        <button class="btn btn-primary account__logout" id="logout" type="button">
                           Выйти из аккаунта 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

JS для табов в макете рботал так

```js
let logoutEl = document.getElementById('logout');
console.log(logoutEl);

function userLogout(){
  /* Будет реализована на втором этапе */
  console.log('User log out!');
}

/* logoutEl.addEventListener('click', function(){
  userLogout();
}) */

function deleteFromTheFavorites(){
  /* Будет реализована на втором этапе */
  console.log('The film has been removed from the favorites list!');
}

const showTab = (elTabBtn) => {
  const elTab = elTabBtn.closest('.account__tab');
  if (elTabBtn.classList.contains('account__tab-btn--active')) {
    return;
  }
  const targetId = elTabBtn.dataset.targetId;
 const elTabPane = elTab.querySelector(`.account__tab-pane[data-id="${targetId}"]`);
  if (elTabPane) {
    const elTabBtnActive = elTab.querySelector('.account__tab-btn--active');
    elTabBtnActive.classList.remove('account__tab-btn--active');
    const elTabPaneShow = elTab.querySelector('.account__tab-pane--active');
    elTabPaneShow.classList.remove('account__tab-pane--active');
    elTabBtn.classList.add('account__tab-btn--active');
    elTabPane.classList.add('account__tab-pane--active');
  }
}

document.addEventListener('click', (e) => {
  if (e.target && !e.target.closest('.account__tab-btn')) {
    return;
  }
  const elTabBtn = e.target.closest('.account__tab-btn');
  showTab(elTabBtn);
});



function handleFilmCardHover() {
  const filmCards = document.querySelectorAll('.account__film-card');

  filmCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const deleteBtn = card.querySelector('.account__film-delete');
      if (deleteBtn) {
        deleteBtn.classList.add('account__film-delete--active');
      }
    });

    card.addEventListener('mouseleave', () => {
      const deleteBtn = card.querySelector('.account__film-delete');
      if (deleteBtn) {
        deleteBtn.classList.remove('account__film-delete--active');
      }
    });

    const deleteBtn = card.querySelector('.account__film-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const filmTitleEl = card.querySelector('.visually-hidden');
        const filmTitle = filmTitleEl ? filmTitleEl.textContent.trim() : 'Неизвестный фильм';

        console.log('Фильм удалён из избранного:', filmTitle);
        deleteFromTheFavorites();
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  handleFilmCardHover();
});
```

#### Модальные окна

Окно логина

```html
<div class="modal" id="loginModal">
  
   <div class="login">
   <form class="form form--active  login-form" id="loginForm" action="#" method="get">
      
        <button class="modal__close" id="loginClose" aria-label="выход" type="button">
            <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
                    <use xlink:href="img/sprite.svg#icon-close-black"></use>
            </svg>
        </button>
        <img class="form__logo" src="img/logo-light.png" alt="Маруся лого"> 
        <fielddet class="form__fields">
            <label class="form__label" for="email">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-email"></use>
                </svg>

                <input class="form__field" id="email" type="email" name="email" placeholder="Электронная почта">
            </label>
            <label class="form__label" for="password">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-key"></use>
                </svg>
                <input class="form__field" id="password" type="password" name="password" placeholder="Пароль">
            </label>
          
        </fielddet>
        <div class="form__buttons">
            <button class="btn btn-primary form__submit-btn" type="submit">
                Войти
            </button>
        </div>
        <button class="btn form__toggle-btn" type="button">
            Регистрация
        </button> 

    </form>

    <form class="form register-form" id="registerForm" action="#" method="get">
        <button class="modal__close" id="registerClose" aria-label="выход" type="button">
            <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
                    <use xlink:href="img/sprite.svg#icon-close-black"></use>
            </svg>
        </button>
        <img class="form__logo" src="img/logo-light.png" alt>
         <h2 class="form__title">
            Регистрация
         </h2>
        <fielddet class="form__fields">
            <label class="form__label" for="registerEmail">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-email"></use>
                </svg>

                <input class="form__field" id="registerEmail" type="email" name="email" placeholder="Электронная почта">
            </label>

            <label class="form__label" for="registerName">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-user-grey"></use>
                </svg>

                <input class="form__field" id="registerName" type="text" name="name" placeholder="Имя">
            </label>

            <label class="form__label" for="registerSurname">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-user-grey"></use>
                </svg>

                <input class="form__field" id="registerSurname" type="text" name="surname" placeholder="Фамилия">
            </label>

            <label class="form__label" for="registerPassword">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-key"></use>
                </svg>
                <input class="form__field" id="registerPassword" type="password" name="password" placeholder="Пароль">
            </label>

            <label class="form__label" for="repeatPassword">
                <svg class="form__icon" aria-hidden="true" width="24" height="24">
                <use xlink:href="img/sprite.svg#icon-key"></use>
                </svg>
                <input class="form__field" id="repeatPassword" type="password" name="password" placeholder="Подтвердите пароль">
            </label>
          
        </fielddet>
        <div class="form__buttons">
            <button class="btn btn-primary form__submit-btn" type="submit">
                Войти
            </button>
        </div>
        <button class="btn form__toggle-btn" type="button">
            Регистрация
        </button> 

    </form>

    <div class="login__success">
        <button class="modal__close" id="successClose" aria-label="выход" type="button">
            <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
                    <use xlink:href="img/sprite.svg#icon-close-black"></use>
            </svg>
        </button>
        <img class="login__success-logo" src="img/logo-light.png" alt="Маруся лого">
        <h2 class="login__success-title">
            Регистрация завершена
        </h2>
        <p class="login__success-text">
          Используйте вашу электронную почту для входа  
        </p>
        <button class="btn btn-primary login__success-btn" type="button">
           Войти 
        </button>
    </div> 
</div> 

</div>
```

Окно просмотра

```html
<div class="modal" id="previewModal">
  <div class="preview">
    <button type="button" class="modal__close" id="previewClose">
        <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
                <use xlink:href="img/sprite.svg#icon-close-black"></use>
        </svg>
    </button>
    <!-- Контейнер Plyr -->
      <div class="plyr__video-embed" id="player" data-url="https://youtu.be/VYML35ZisMQ?si=WeXJBah-j9799TB_">
        <iframe
          id="videoFrame"
          allowfullscreen
          allowtransparency
          allow="autoplay"
          title="YouTube video player">
        </iframe>
      </div>

   
</div>
</div>
```

Js для формирования embed ссылок

```js
 // Функция конвертации ссылки (уже у вас есть)
function convertToEmbedLink(watchLink) {
    try {
        const url = new URL(watchLink);

        // Формат 1: https://www.youtube.com/watch?v=abc123
        let videoId = url.searchParams.get("v");

        // Формат 2: https://youtu.be/abc123
        if (!videoId) {
            const pathParts = url.pathname.split("/").filter(part => part);
            if (pathParts.length > 0) {
                videoId = pathParts[pathParts.length - 1]; // Последняя часть пути
            }
        }

        if (!videoId) {
            console.error("Не удалось извлечь video ID из ссылки:", watchLink);
            return "";
        }

        // Очистка от возможных мусорных символов (например, если ID содержит ?)
        videoId = videoId.split("?")[0];

        const embedLink = `https://www.youtube.com/embed/${videoId}`;
        return embedLink;
    } catch (e) {
        console.error("Некорректная ссылка YouTube:", watchLink, e);
        return "";
    }
}

// Загружаем видео при открытии модального окна (или при загрузке страницы)
document.addEventListener("DOMContentLoaded", function () {
    const player = document.getElementById("player");
    const iframe = document.getElementById("videoFrame");

    if (player && iframe) {
        const watchLink = player.getAttribute("data-url");
        const embedLink = convertToEmbedLink(watchLink);
        if (embedLink) {
            iframe.src = embedLink;
        }
    }
});

  


```

#### footer

```html
<footer class="footer">
  <div class="container footer__container">
    <ul class="social">
    <li class="social__item">
        <a href="https://vk.com" class="social__link" aria-label="Маруся ВКонтакте">
            <svg width="36" height="36" class="social__icon" aria-hidden="true">
              <use xlink:href="img/sprite.svg#icon-vk"></use>
            </svg>
        </a>
    </li>
    <li class="social__item">
        <a href="https://www.youtube.com/" class="social__link" aria-label="Маруся в YouTube">
            <svg width="36" height="36" class="social__icon" aria-hidden="true">
              <use xlink:href="img/sprite.svg#icon-youtube"></use>
            </svg>
        </a>
    </li>
    <li class="social__item">
        <a href="https://ok.ru/" class="social__link" aria-label="Маруся в Одноклассниках">
            <svg width="36" height="36" class="social__icon" aria-hidden="true">
              <use xlink:href="img/sprite.svg#icon-ok"></use>
            </svg>
        </a>
    </li>
    <li class="social__item">
        <a href="https://t.me" class="social__link" aria-label="Маруся в Telegram">
            <svg width="36" height="36" class="social__icon" aria-hidden="true">
              <use xlink:href="img/sprite.svg#icon-tg"></use>
            </svg>
        </a>
    </li>
</ul>
  </div>
</footer>
```

### Тестирование

Нужно с помощью Jest покрыть unit-тестами наиболее важные функции, такие, как логин, и валидация формы, работа со списком избранного, etc

- В тестах должны содержатся корректные описания, по которым сразу понятно, какая функциональность тестируется.
- Тесты должны быть расположены в той же папке, что и тестируемый код.
