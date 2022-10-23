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
export default slider;