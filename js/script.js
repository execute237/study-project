import calc from './modules/calc';
import form from './modules/form';
import menu from './modules/menu';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
import {openModal} from './modules/modal';

document.addEventListener('DOMContentLoaded', (e) => {

    const modalTimer = setTimeout (() => openModal('.modal',modalTimer), 50000);


    calc();
    form(modalTimer, );
    menu();
    modal('[data-modal]', '.modal', modalTimer);
    tabs('.tabheader__items', '.tabheader__item', '.tabcontent', 'tabheader__item_active');
    timer('.timer', '2022-10-30');
    slider({
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