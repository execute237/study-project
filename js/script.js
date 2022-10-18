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
          sliderMain = document.querySelector('.offer__slider'),
          sliderCurrent = document.querySelector('#current'),
          sliderTotal = document.querySelector('#total'),
          sliderImg = document.querySelectorAll('.offer__slide'),
          sliderWrapper = document.querySelector('.offer__slider-wrapper'),
          sliderField = document.querySelector('.offer_slider-inner'),
          sliderWidth = window.getComputedStyle(sliderWrapper).width;

    let sliderIndex = 1;
    let offset = 0;

    if(sliderImg.length < 10) {
        sliderTotal.textContent = `0${sliderImg.length}`;
        sliderCurrent.textContent = `0${sliderIndex}`;
    }else {
        sliderTotal.textContent = sliderImg.length;
        sliderCurrent.textContent = sliderIndex;
    }

    sliderField.style.width = 100 * sliderImg.length + '%';
    sliderField.style.display = 'flex';
    sliderField.style.transition = '0.5s all';

    sliderWrapper.style.overflow = 'hidden';

    sliderImg.forEach (item => {
        item.style.width = sliderWidth;
    });

    sliderMain.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];

    indicators.classList.add('carousel-indicators');
    sliderMain.append(indicators);

    for (let i = 0; i < sliderImg.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');

        if(i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    }

    const dotOpacity = () => {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[sliderIndex- 1].style.opacity = 1;
    };

    const currentFilter = () => {
        if(sliderImg.length < 10){
            sliderCurrent.textContent = `0${sliderIndex}`;
        }else {
            sliderCurrent.textContent = sliderIndex;
        }
    };

    const widthTransform = str => +str.replace(/\D/g, ''); // удаляет все НЕ цифры



    sliderNext.addEventListener('click', () => {
        if (offset == widthTransform(sliderWidth) * (sliderImg.length - 1)){
            offset = 0;
        }else {
            offset += widthTransform(sliderWidth);
        }

        sliderField.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex == sliderImg.length) {
            sliderIndex = 1;
        }else {
            sliderIndex++;
        }
        currentFilter();
        dotOpacity();
    });

    sliderPrev.addEventListener('click', () => {
        if (offset == 0){
            offset = widthTransform(sliderWidth) * (sliderImg.length - 1);
        }else {
            offset -= widthTransform(sliderWidth);
        }

        sliderField.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex == 1) {
            sliderIndex = sliderImg.length;
        }else {
            sliderIndex--;
        }

        currentFilter();
        dotOpacity();
    });

    dots.forEach (dot => {
        dot.addEventListener ('click', (e) => {
            const slideTo = e.target.getAttribute ('data-slide-to');

            sliderIndex = slideTo;
            offset = widthTransform(sliderWidth) * (slideTo - 1);
            sliderField.style.transform = `translateX(-${offset}px)`;

            currentFilter();
            dotOpacity();
        });
    });

    //calc

    const resultCcal = document.querySelector('.calculating__result span');
    let sex,age,height,weight,ratio;

    if(localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    }else{
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    }else{
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function setLocalStorage(selector, activeClass){
        const element = document.querySelectorAll(selector);

        element.forEach(item => {
            item.classList.remove(activeClass);
            
            if(item.getAttribute('id') === localStorage.getItem('sex')){
                item.classList.add(activeClass);
            }
            if(item.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                item.classList.add(activeClass);
            }
        });
    }

    setLocalStorage('#gender div', 'calculating__choose-item_active');
    setLocalStorage('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcResult () {

        if (!sex || !age || !height || !weight || !ratio){
        resultCcal.textContent = '0';
        return;
        }

        if (sex === 'female') {
            resultCcal.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }else {
            resultCcal.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcResult ();

    function staticInformation (selector, activeClass) {
        const element = document.querySelectorAll (selector);

        element.forEach (item => {
            item.addEventListener('click', (e) => {

                if (e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                }else {
                    sex = e.target.getAttribute('id'); 
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                element.forEach (item => {
                    item.classList.remove (activeClass);
                });
                e.target.classList.add (activeClass);

                calcResult();
            });
        }); 
    }

    staticInformation('#gender div', 'calculating__choose-item_active');
    staticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
 

    function dynamicInformation (selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if(input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            }else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                   height = +input.value;
                   break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                   age = +input.value;
                   break;
            }
            calcResult();
        });
    }

    dynamicInformation ('#height');
    dynamicInformation ('#weight');
    dynamicInformation ('#age');
});