
// цикличный фон анкеты (работает с божьей помощью)
function createOverlappingBackground(desktopFlag, fragmentHeight, offset, lastFragmentHeight) {
    let anketa = document.querySelector('.questionnaire');
    let blockHeight = anketa.offsetHeight;
    let fragmentCount = Math.ceil(blockHeight / fragmentHeight) + 2;
    let currentHeight = 0;

    let lastFragment = document.createElement('div');
    lastFragment.classList.add('fragment');
    lastFragment.style.position = 'absolute';
    lastFragment.style.left = '0';
    lastFragment.style.right = '0';
    lastFragment.style.bottom = '0';
    lastFragment.style.backgroundRepeat = 'no-repeat';
    lastFragment.style.backgroundSize = '100% 100%';
    lastFragment.style.zIndex = fragmentCount + 1;
    lastFragment.style.height = 29 + 'px';

    for (let i = 0; i < fragmentCount; i++) {
        let fragment = document.createElement('div');
        fragment.classList.add('fragment');
        fragment.style.position = 'absolute';
        fragment.style.left = '0';
        fragment.style.right = '0';
        fragment.style.backgroundRepeat = 'no-repeat';

        currentHeight += fragmentHeight;

        if (!desktopFlag) {
            lastFragment.style.backgroundImage = "url('./img/anketa_background_part_mobile_last.png')";
            fragment.style.top = (i * fragmentHeight - offset * i) + 'px'; // смещение каждого
            fragment.style.backgroundImage = "url('./img/anketa_background_part_mobile.png')";
            fragment.style.zIndex = fragmentCount - i;

            if (currentHeight >= blockHeight) {
                let diff = currentHeight - offset - blockHeight;
                fragment.style.height = (fragmentHeight - offset - diff - lastFragmentHeight) + 'px';
                fragment.style.backgroundSize = '100%';

                anketa.appendChild(fragment);
                anketa.appendChild(lastFragment);
                break;
            } else {
                fragment.style.height = fragmentHeight + 'px';
                fragment.style.backgroundSize = '100% 100%';
                anketa.appendChild(fragment);
            }
        }
        else {
            lastFragment.style.backgroundImage = "url('./img/anketa_background_part_desktop_last.png')";
            fragment.style.top = (i * fragmentHeight - offset * i) + 'px'; // смещение каждого
            fragment.style.backgroundImage = "url('./img/anketa_background_part_desktop.png')";
            fragment.style.zIndex = fragmentCount - i;

            if (currentHeight >= blockHeight) {
                let diff = currentHeight - offset - blockHeight;
                fragment.style.height = (fragmentHeight - offset - diff - lastFragmentHeight) + 'px';
                // fragment.style.backgroundSize = '100% 100%';
                fragment.classList.add('clip_path');

                anketa.appendChild(fragment);
                // anketa.appendChild(lastFragment);
                break;
            } else {

                fragment.style.height = fragmentHeight + 'px';
                fragment.style.backgroundSize = '100% 100%';
                anketa.appendChild(fragment);
            }
        }

        currentHeight -= offset;
    }
}


// валидация формы и отправка ответов
let form = document.querySelector('.questionnaire__form');
let formContainer = document.querySelector('.questionnaire__container_default');
let successContainer = document.querySelector('.questionnaire__container_success');
let errorContainer = document.querySelector('.questionnaire__container_error');
let requiredInputs = document.querySelectorAll('.question__input[required]');
let requiredRadiosContainer = document.querySelectorAll('.form__question:has(.question__radio[required])');

function validateForm() {
    let isValid = true;

    // проверка заполненности обязательных input type=text
    requiredInputs.forEach(input => {
        let questionContainer = input.closest('.form__question');
        if (!input.value.trim()) {
            questionContainer.classList.add('error');
            isValid = false;
        } else {
            questionContainer.classList.remove('error');
        }
    });

    // проверка заполненности обязательных input type=radio
    requiredRadiosContainer.forEach(radiosContainer => {
        let checked = radiosContainer.querySelector('.question__radio:checked');
        if (!checked) {
            radiosContainer.classList.add('error');
            isValid = false;
        } else {
            radiosContainer.classList.remove('error');
        }
    });

    return isValid;
}

function sendingData(event) {
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // важно для Google Forms
    }).then(() => {
        formContainer.style.display = 'none';
        successContainer.style.display = 'flex';
    }).catch(() => {
        formContainer.style.display = 'none';
        errorContainer.style.display = 'block';
    });
}

form.addEventListener('click', event => {
    if (event.target.closest('.form__submit')) {
        event.preventDefault();

        let isValid = validateForm();
        if (isValid) {
            sendingData(event);
        }
        else {
            if (window.matchMedia('(min-width: 750px)').matches) {
                let fragments = document.querySelectorAll('.fragment');
                fragments.forEach(element => {
                    element.remove();
                });

                createOverlappingBackground(true, 564, 178, 0); // desktop and tablet = 168, 0
            }
            else {
                createOverlappingBackground(false, 253.51, 78, 22); // mobile
            }
        }
    }
});


// адаптив
let locationHead = document.querySelector('.location__head');
let locationInfo = document.querySelector('.location__info');
let dresscodeBtn = document.querySelector('.dresscode__btn');
let dresscodeInfo = document.querySelector('.dresscode__info');

function changeElems() {
    locationInfo.insertAdjacentElement('afterbegin', locationHead);
    dresscodeInfo.insertAdjacentElement('beforeend', dresscodeBtn);
}

function calculateMainBack() {
    let paperBack = document.querySelector('.main__back');
    let body = document.body;
    let invitation = document.querySelector('.invitation');
    let header = document.querySelector('.header');
    paperBack.style.height = body.offsetHeight - header.offsetHeight - invitation.offsetHeight + 50 + 'px';
}

if (window.matchMedia('(min-width: 750px)').matches) {
    Promise.all([changeElems()])
        .then(async () => {
            // Даём браузеру время на перерасчёт макета
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            // Дополнительная задержка для применения стилей к новым элементам
            await new Promise(resolve => setTimeout(resolve, 100));

            // подсчет высоты фона в main__back
            setTimeout(calculateMainBack(), 50);
        });

    createOverlappingBackground(true, 564, 178, 0); // desktop and tablet = 168, 0
} else {
    // подсчет высоты фона в main__back
    setTimeout(calculateMainBack(), 50);

    createOverlappingBackground(false, 253.51, 78, 22); // mobile
}