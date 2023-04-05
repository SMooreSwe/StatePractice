"use strict";
const stateObject = [];
const itemName = document.querySelector('#txtCardTitle');
const itemDescription = document.querySelector('#txtCardDescrip');
const cardList = document.querySelector('#cardList');
const writeToStorage = () => {
    window.localStorage.setItem('wishlist', JSON.stringify(stateObject));
};
const createRemoveButton = () => {
    const removeButton = document.createElement('button');
    removeButton.id = 'btnDeleteCard';
    removeButton.classList.add('list-item__btn');
    removeButton.setAttribute('data-testid', 'btnDeleteCard');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        const index = stateObject.findIndex(item => item.name === removeButton.parentElement?.id);
        stateObject.splice(index, 1);
        writeToStorage();
        removeButton.parentElement?.remove();
    });
    return removeButton;
};
const createCardItem = (item) => {
    const cardItem = document.createElement('article');
    cardItem.id = item.name;
    cardItem.setAttribute('data-testid', 'cardItem');
    cardItem.classList.add('card-list__list-item');
    cardItem.innerHTML = `<h2 class="list-item__title">${item.name}</h2>`;
    if (item.description) {
        cardItem.innerHTML += `\n<p class="list-item__descrip">${item.description}</p>`;
    }
    cardItem.addEventListener('click', () => {
        cardItem.classList.toggle('list__item--completed');
        const index = stateObject.findIndex(stateItem => stateItem.name === cardItem.id);
        if (cardItem.classList.contains('list__item--completed') && index !== -1) {
            stateObject[index].done = true;
            writeToStorage();
            cardItem.appendChild(createRemoveButton());
        }
        else {
            if (index !== -1) {
                stateObject[index].done = false;
            }
            writeToStorage();
            const buttonChild = cardItem.querySelector('#btnDeleteCard');
            cardItem.removeChild(buttonChild);
        }
    });
    return cardItem;
};
const appendCard = (isDone) => {
    if (itemName.value) {
        const newItem = {
            name: itemName.value,
            description: itemDescription.value,
            done: isDone,
        };
        stateObject.push(newItem);
        writeToStorage();
        cardList.appendChild(createCardItem(newItem));
        itemName.value = '';
        itemDescription.value = '';
    }
};
const useLocalStorage = () => {
    const wishlist = window.localStorage.getItem('wishlist');
    if (wishlist) {
        JSON.parse(wishlist).forEach((item) => {
            const newCard = createCardItem(item);
            if (item.done === true) {
                newCard.classList.add('list__item--completed');
                newCard.appendChild(createRemoveButton());
            }
            stateObject.push(item);
            cardList.appendChild(newCard);
        });
    }
};
document.querySelector('#btnAddCard').addEventListener('click', () => {
    appendCard(false);
});
document.onkeydown = event => {
    if (event.key === 'Enter') {
        appendCard(false);
    }
};
document.onkeydown = event => {
    if (event.key === 'Backspace'
        && document.activeElement !== itemName
        && document.activeElement !== itemDescription) {
        document.querySelectorAll('.list__item--completed').forEach(card => {
            const index = stateObject.findIndex(item => item.name === card.id);
            stateObject.splice(index, 1);
            writeToStorage();
            card.remove();
        });
    }
};
useLocalStorage();
