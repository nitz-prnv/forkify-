import { elements } from './Base';
import { limitRecipesTitle } from './searchView';

export const toggleLikeBtn = (isLiked) => {
    const likeString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href' , `img/icons.svg#${likeString}`);
}

export const toggleLikeMenu = numLike => {
     elements.likeMenu.style.visibility = numLike > 0 ? 'visible' : 'hidden';
}

export const renderLike = (like) => {
    const markup = `
                        <li>
                            <a class="likes__link" href="#${like.id}">
                                <figure class="likes__fig">
                                    <img src="${like.img}" alt="${limitRecipesTitle(like.name)}">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="likes__name">${like.name}</h4>
                                    <p class="likes__author">${like.publisher}</p>
                                </div>
                            </a>
                        </li>
    `;
    elements.likeList.insertAdjacentHTML('beforeend' , markup);
};

export const deleteLike = (id) => {
    const el =  document.querySelector(`.likes__list[href*="#${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);
}