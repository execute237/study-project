/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function calc () {
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
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/form.js":
/*!****************************!*\
  !*** ./js/modules/form.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");



function form (modalTimer, formSelector) {
    const forms = document.querySelectorAll (formSelector);

    const status = {
        loading: 'icons/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach ((item) => {
        bindPostData (item);
    });

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
            
            (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
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
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)('.modal', modalTimer);

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
            (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
        }, 4000);
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (form);

/***/ }),

/***/ "./js/modules/menu.js":
/*!****************************!*\
  !*** ./js/modules/menu.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function menu () {
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

    (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResource) ('http://localhost:3000/menu')
    .then (data => {
        data.forEach (({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (menu);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "openModal": () => (/* binding */ openModal)
/* harmony export */ });
const closeModal = (modalSelector) => {
    const modalWindow = document.querySelector(modalSelector);
    modalWindow.style.display = 'none';
    document.body.style.overflow = ''; 
    };  

const openModal = (modalSelector, modalTimer) => {
    const modalWindow = document.querySelector(modalSelector);
    modalWindow.style.display = 'block';
    document.body.style.overflow = 'hidden';

    if (modalTimer){
        clearTimeout (modalTimer);
    }
    };

function modal (triggerSelector, modalSelector, modalTimer) {
    const modalOpen = document.querySelectorAll(triggerSelector),
    modalWindow = document.querySelector(modalSelector);

    modalOpen.forEach (item => {
    item.addEventListener ('click', () => openModal(modalSelector, modalTimer));
    });

    modalWindow.addEventListener ('click', (e) => {
    if (e.target == modalWindow || e.target.classList.contains('modal__close')) {
        closeModal(modalSelector);
    }
    });

    document.addEventListener ('keydown', (e) => {
    if (e.code === 'Escape' && modalWindow.style.display == 'block') {
        closeModal(modalSelector);
    }
    });

    function showModalByScroll () {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
        openModal(modalSelector, modalTimer);
        window.removeEventListener ('scroll', showModalByScroll);
    }
    }

    window.addEventListener ('scroll', showModalByScroll);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);


/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function slider ({nextArrow, prevArrow, container, current, total, img, wrapper, field}) {
    const sliderNext = document.querySelector(nextArrow),
    sliderPrev = document.querySelector(prevArrow),
    sliderMain = document.querySelector(container),
    sliderCurrent = document.querySelector(current),
    sliderTotal = document.querySelector(total),
    sliderImg = document.querySelectorAll(img),
    sliderWrapper = document.querySelector(wrapper),
    sliderField = document.querySelector(field),
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
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs (tabsParentSelector, tabsSelector, tabsContentSelector, activeSelector) {
    const tabsParent = document.querySelector(tabsParentSelector),
          tabs = document.querySelectorAll(tabsSelector),
          tabContent = document.querySelectorAll (tabsContentSelector);

    function hideContent () {
        tabContent.forEach (item => {
            item.classList.add ('hide');
            item.classList.remove ('show');
        });
        tabs.forEach (item => {
            item.classList.remove (activeSelector);
        });
    }

    function showContent (i = 0) {
        tabContent[i].classList.add ('show');
        tabContent[i].classList.remove ('hide');
        tabs[i].classList.add (activeSelector);
    }


    tabsParent.addEventListener ('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains (tabsSelector.slice(1))) {
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
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function timer (id, deadline) {
    
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

    setClock (id, deadline);
} 

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);

/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getResource": () => (/* binding */ getResource),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
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

const getResource = async (url) => {
    const res = await fetch (url);
    if (!res.ok){
        throw new Error (`Could not fetch ${url}, status:${res.status}`);
    }
    return await res.json();
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/form */ "./js/modules/form.js");
/* harmony import */ var _modules_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/menu */ "./js/modules/menu.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");









document.addEventListener('DOMContentLoaded', (e) => {

    const modalTimer = setTimeout (() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_3__.openModal)('.modal',modalTimer), 50000);


    (0,_modules_calc__WEBPACK_IMPORTED_MODULE_0__["default"])();
    (0,_modules_form__WEBPACK_IMPORTED_MODULE_1__["default"])(modalTimer, );
    (0,_modules_menu__WEBPACK_IMPORTED_MODULE_2__["default"])();
    (0,_modules_modal__WEBPACK_IMPORTED_MODULE_3__["default"])('[data-modal]', '.modal', modalTimer);
    (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_5__["default"])('.tabheader__items', '.tabheader__item', '.tabcontent', 'tabheader__item_active');
    (0,_modules_timer__WEBPACK_IMPORTED_MODULE_6__["default"])('.timer', '2022-10-30');
    (0,_modules_slider__WEBPACK_IMPORTED_MODULE_4__["default"])({
        nextArrow:'.offer__slider-next',
        prevArrow:'.offer__slider-prev',
        container:'.offer__slider',
        current:'#current',
        total:'#total',
        img:'.offer__slide',
        wrapper:'.offer__slider-wrapper',
        field:'.offer_slider-inner'
    });


});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map