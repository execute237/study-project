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

export default modal;
export {openModal,closeModal};