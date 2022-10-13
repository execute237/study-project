document.addEventListener('DOMContentLoaded', (e) => {

//tabs
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


//timer
    const deadLine = '2022-10-30';
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
//modal
    const modalOpen = document.querySelectorAll('[data-modal]'),
          modalWindow = document.querySelector('.modal');
    

    const openModal = () => {
        modalWindow.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearTimeout (modalTimer);
        window.removeEventListener('scroll', showModalByScroll);
    };

    modalOpen.forEach (item => {
        item.addEventListener ('click', openModal);
    });


    const closeModal = () => {
        modalWindow.style.display = 'none';
        document.body.style.overflow = ''; 
    };  

    modalWindow.addEventListener ('click', (e) => {
        if (e.target == modalWindow || e.target.classList.contains('modal__close')) {
            closeModal();
        }
    });

    document.addEventListener ('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.style.display == 'block') {
            closeModal();
        }
    });
    
    const modalTimer = setTimeout (openModal, 50000);

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

    const getResource = async (url) => {
        const res = await fetch (url);
        if (!res.ok){
            throw new Error (`Could not fetch ${url}, status:${res.status}`);
        }
        return await res.json();
    };

    getResource ('http://localhost:3000/menu')
    .then (data => {
        data.forEach (({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });
    
    //Forms with fetch
    const forms = document.querySelectorAll ('form');

    const status = {
        loading: 'icons/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach ((item) => {
        bindPostData (item);
    });

    const postData = async (url, data) => {
        const res = await fetch (url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-type': 'application/json'
            }
        });

        return await res.json();
    };

    function bindPostData (form) {

        form.addEventListener ('submit', (e) => {
            e.preventDefault();

            const statusNote = document.createElement ('img');
            statusNote.src = status.loading;
            statusNote.style.cssText =`
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusNote);

            const formData = new FormData (form);
            const json = JSON.stringify (Object.fromEntries(formData.entries()));
            
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showStatusModal(status.success);
                form.reset();
                statusNote.remove();
            })
            .catch(() => showStatusModal(status.failure))
            .finally(() => form.reset());
        });
    }

    function showStatusModal (message) {
        const modal = document.querySelector ('.modal__dialog');
        modal.classList.add ('hide');
        openModal();

        const statusMessage = document.createElement('div');
        statusMessage.classList.add('modal__dialog');
        statusMessage.innerHTML = `
        <div class="modal__content">
                <div class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
        </div>
        `;
        
        document.querySelector('.modal').append(statusMessage);
        setTimeout(() => {
            statusMessage.remove();
            modal.classList.add ('show');
            modal.classList.remove ('hide');
            closeModal();
        }, 4000);
    }

    //slider

    const sliderNext = document.querySelector('.offer__slider-next'),
          sliderPrev = document.querySelector('.offer__slider-prev'),
          sliderCurrent = document.querySelector('#current'),
          sliderImg = document.querySelectorAll('.offer__slide');

    function slider () {
        let curr = 1;
        sliderCurrent.textContent = '01';

        sliderImg.forEach (item => item.classList.add('hide') );
        sliderImg[curr-1].classList.remove('hide');

        const showCurrent = (num) => {
            if (num < 10){
                sliderCurrent.textContent= `0${num}`;
            }else {
                sliderCurrent.textContent= `${num}`;
            }
        };

        sliderNext.addEventListener('click', (e) => {
            sliderImg[curr-1].classList.add('hide');
            if (curr != 4) {
                ++curr;
            }else {
                curr = 1;
            }

            sliderImg[curr-1].classList.remove('hide');
            showCurrent(curr);

        });

        sliderPrev.addEventListener('click', (e) => {
            sliderImg[curr-1].classList.add('hide');
            if (curr != 1) {
                --curr;
            }else {
                curr = 4;
            }
            sliderImg[curr-1].classList.remove('hide');
            showCurrent(curr);
        });
    }
    slider();

});