import {openModal,closeModal} from './modal';
import {postData} from '../services/services';

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
        openModal('.modal', modalTimer);

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
            closeModal('.modal');
        }, 4000);
    }
}

export default form;