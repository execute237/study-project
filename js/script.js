document.addEventListener('DOMContentLoaded', (e) => {

    //tabs---------------------------------
    const tabsParent = document.querySelector('.tabheader__items'),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabContent = document.querySelectorAll ('.tabcontent');

    function hideContent () {
        tabContent.forEach (item => {
            item.classList.add ('hide');
            item.classList.remove ('show');
        });
        tabs.forEach (item => {
            item.classList.remove ('tabheader__item_active');
        });
    }

    function showContent (i = 0) {
        tabContent[i].classList.add ('show');
        tabContent[i].classList.remove ('hide');
        tabs[i].classList.add ('tabheader__item_active');
    }


    tabsParent.addEventListener ('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains ('tabheader__item')) {
            tabs.forEach ((item,i) => {
                if (target == item) {

                    hideContent();
                    showContent(i);
                }
            });
        }
    });

    hideContent ();
    showContent();


    //timer---------------------------------
    const deadLine = '2022-10-06';
    function getTimeRemain (endTime) {
        let days,hours,minutes,seconds;
        let total = Date.parse (endTime) - Date.parse(new Date ());

            if (total <= 0){
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
            }else {
                days = Math.floor (total / (1000 * 60 * 60 * 24));
                hours = Math.floor ((total / (1000 * 60 * 60)) % 24);
                minutes = Math.floor ((total / (1000*60)) % 60);
                seconds = Math.floor ((total / 1000) % 60);
            }

            return {
                total, days, hours, minutes, seconds
            };
    }

    function setZero (num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        }else {
            return num;
        }
    }

    function setClock (selector, endTime) {
        const timer = document.querySelector (selector),
              days = timer.querySelector ('#days'),
              hours = timer.querySelector ('#hours'),
              minutes = timer.querySelector ('#minutes'),
              seconds = timer.querySelector ('#seconds'),
              timeInterval = setInterval (updateClock, 1000);
            
            updateClock();
        
        function updateClock () {
            const t = getTimeRemain(endTime);

            days.innerHTML = setZero(t.days);
            hours.innerHTML = setZero(t.hours);
            minutes.innerHTML = setZero(t.minutes);
            seconds.innerHTML = setZero(t.seconds);

            if (t.total <= 0) {
                clearInterval (timeInterval);
            }
        }
    }

    setClock ('.timer', deadLine);

    //modal---------------------------------
    const modalOpen = document.querySelectorAll ('[data-modal]'),
          modalWindow = document.querySelector ('.modal'),
          modalClose = document.querySelector ('.modal__close');
    

    const openModal = () => {
        modalWindow.style.display = 'block';
        document.body.style.overflow = 'hidden';
/*         clearTimeout (modalTimer); */
        window.removeEventListener('scroll', showModalByScroll);
    };

    modalOpen.forEach (item => {
        item.addEventListener ('click', openModal);
    });


    const closeModal = () => {
        modalWindow.style.display = 'none';
        document.body.style.overflow = ''; 
    };  

    modalClose.addEventListener ('click', closeModal);

    modalWindow.addEventListener ('click', (e) => {
        if (e.target == modalWindow) {
            closeModal();
        }
    });

    document.addEventListener ('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.style.display == 'block') {
            closeModal();
        }
    });
    
/*     const modalTimer = setTimeout (openModal, 5000); */

    function showModalByScroll () {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
        }
    }

    window.addEventListener ('scroll', showModalByScroll);

// menu
    class MenuCard {
        constructor (src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector (parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH () {
            this.price = this.price * this.transfer;
        }

        render () {
            const elem = document.createElement ('div');

            if (this.classes.length === 0) {
                this.defClass = 'menu__item';
                elem.classList.add (this.defClass);
            }else {
                this.classes.forEach (item => elem.classList.add(item));            }
            elem.innerHTML = 
            `
            <img src="${this.src}" alt="${this.alt}">
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;
                
            this.parent.append(elem);
        }
    }

    const firstCard = new MenuCard (
        "img/tabs/vegy.jpg", 
        'vegy',
        'Меню "Фитнес"',
        `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих
        овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
        ценой и высоким качеством!`,
        10,
        '.menu .container'
    );

    const secondCard = new MenuCard(
        "img/tabs/elite.jpg", 
        'vegy',
        'Меню "Премиум"',
        `В меню "Премиум" мы используем не только красивый дизайн упаковки, но
        и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода
        в ресторан!`,
        20,
        '.menu .container'
    );

    const thirdCard = new MenuCard(
        "img/tabs/post.jpg", 
        'vegy',
        'Меню "Постное"',
        `Меню "Постное" - это тщательный подбор ингредиентов: полное отсутствие
        продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное
        количество белков за счет тофу и импортных вегетарианских стейков.`,
        15,
        '.menu .container'
    );

    firstCard.render();
    secondCard.render();
    thirdCard.render();

    //Forms with XMLHttpRequest

    const forms = document.querySelectorAll ('form');

    const status = {
        loading: 'Загрузка...',
        success: 'Спасибо! Мы скоро с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach ((item) => {
        postData (item);
    });

    function postData (form) {

        form.addEventListener ('submit', (e) => {
            e.preventDefault();

            const statusNote = document.createElement ('div');
            statusNote.textContent = status.loading;
            form.append (statusNote);

            const request = new XMLHttpRequest ();
            request.open('POST', 'server.php');
            request.setRequestHeader ('Content-type', 'application/json; charset=utf-8');

            const formData = new FormData (form);
            const obj = {};
            formData.forEach (function(value, key) {
                obj[key] = value;
            });
            const json = JSON.stringify(obj);

            request.send(json);
            request.addEventListener ('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusNote.textContent = status.success;
                    form.reset();
                    setTimeout (() => {
                        statusNote.remove();
                    }, 2000);
                }else {
                    statusNote.textContent = status.failure;
                }
            });

        });
    }
    
});


