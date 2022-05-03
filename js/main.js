// burger menu
function getScrollbarWidth() {

    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

function initBurgerMenu() {
    const burgerBtn = document.querySelector('.burger-js');
    const headerMenu = document.querySelector('.header-menu-js');
    const menuItems = headerMenu.querySelectorAll('a');
    const menuCloseBtn = headerMenu.querySelector('.menu-close-js');

    if (!burgerBtn || !headerMenu) return;

    let scrollbarWidth = getScrollbarWidth();

    function openMenu() {
        document.body.classList.toggle('no-scroll');
        scrollbarWidth = getScrollbarWidth();

        if (document.body.classList.contains('no-scroll')) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.paddingRight = '';
        }

        headerMenu.classList.toggle('active');
    }

    function closeMenu() {
        document.body.classList.remove('no-scroll');
        document.body.style.paddingRight = '';
        headerMenu.classList.remove('active');
    }

    burgerBtn.addEventListener('click', openMenu);

    menuItems.forEach(item => {
        item.addEventListener('click', closeMenu)
    });

    menuCloseBtn.addEventListener('click', closeMenu);
}

initBurgerMenu();

// smooth scroll

function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href*="#"]');

    if (!anchors.length) return;

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (anchor.classList.contains('tabs-link')) return;

            const sectionId = anchor.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);

            if (section) {
                e.preventDefault();
                const y = section.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    });
}
initSmoothScroll();

// swipers

function slidesCounter(swiperContainer, swiper) {
    const swiperCounter = swiperContainer.querySelector('.swiper-counter');
    const swiperCounterCur = swiperCounter.querySelector('.swiper-counter__cur');
    const swiperCounterAll = swiperCounter.querySelector('.swiper-counter__all');

    swiperCounterAll.textContent = swiper.snapGrid.length;
    swiperCounterCur.textContent = swiper.realIndex + 1;

    swiper.on('slideChange', function () {
        swiperCounterCur.textContent = swiper.realIndex + 1;
    });

}

function initSwipers() {
    const introSwiperContainer = document.querySelector('.intro__swiper');
    const quizSwiperContainer = document.querySelector('.quiz-steps__swiper');
    const partnersSwiperContainer = document.querySelector('.partners__swiper');

    if(introSwiperContainer) {
        let introSwiper = new Swiper('.intro__swiper', {
            slidesPerView: 1,
            pagination: {
                el: '.intro__swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
            navigation: {
                nextEl: '.intro__swiper-next',
                prevEl: '.intro__swiper-prev',
            },
        });
        slidesCounter(introSwiperContainer, introSwiper);
    }

    if(quizSwiperContainer) {
        let quizSwiper = new Swiper('.quiz-steps__swiper', {
            slidesPerView: 1,
            reverseDirection: true,
            pagination: {
                el: '.quiz-steps__pagination',
                type: 'bullets',
                clickable: true,
            },
            navigation: {
                nextEl: '.quiz-steps__next',
                prevEl: '.quiz-steps__prev',
            },
        });
    }

    if(partnersSwiperContainer) {
        let partnersSwiper = new Swiper('.partners__swiper', {
            spaceBetween: 5,
            pagination: {
                el: '.partners__swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 4,
                },
                1200: {
                    slidesPerView: 5,
                },
                1400: {
                    slidesPerView: 6,
                }
            }
        });
    }
}
initSwipers();

// tabs

function tabs() {
    const tabsEls = [...document.querySelectorAll('.tabs-js')];

    if (!tabsEls.length) return; 

    function showPane(el) {
        el.classList.add('display');
        setTimeout(() => el.classList.add('show'), 0);
    }

    function hidePane(el) {
        el.classList.remove('show');
        el.classList.remove('display');
    }

    tabsEls.forEach(el => {
        
        if(el.classList.contains('tabs-init')) return;
        el.classList.add('tabs-init');

        const tabsLinks = [...el.querySelectorAll('.tabs-link')];
        const tabsPanes = [...el.querySelectorAll('.tabs-pane')];

        tabsLinks.forEach(link => {
            link.onclick = function(e) {
                e.preventDefault();

                const tabsLinkHref = link.dataset.tabsLink;
                const activePane = tabsPanes.find(item => item.dataset.tabsPane === tabsLinkHref);

                if(!activePane) return;

                tabsLinks.forEach(_link => {
                    _link.classList.remove('active');
                });
                
                tabsPanes.forEach(_pane => {
                    hidePane(_pane);
                });

                showPane(activePane);
                link.classList.add('active');
            }
        });
    });
}

tabs();

// swipers collections

function initSwipersCollection(str, options) {
    const swipers = [...document.querySelectorAll(`.${str}`)];

    if (!swipers.length) return;

    swipers.forEach((swiper, index) => {
        swiper.classList.add(`${str}-${index}`);

        let newSwiper = new Swiper(`.${str}-${index}`, options);
    });
}

initSwipersCollection('swipers-tabs__swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
    },
});

initSwipersCollection('catalog-tabs__swiper', {
    slidesPerView: 3,
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        },
    }
});

// range inputs

function initRangeInputs() {
    const rangeEls = [...document.querySelectorAll('.range')];

    if(!rangeEls.length) return;

    function bindInputs(el, slider) {
        const input = el.querySelector('.form-group__input');
        const inputUnit = el.dataset.unit;
        const inputs = [input];

        slider.noUiSlider.on('update', function(values, handle) {
            input.value = `${Math.round(values[handle])} ${inputUnit}`
        });

        const setRangeSlider = function(i, value) {
            let arr = [null, null];
            arr[i] = value;
            slider.noUiSlider.set(arr);
        }
       
        inputs.forEach((item, index) => {
            item.addEventListener('change', function(e) {
                setRangeSlider(index, e.currentTarget.value);
                item.blur();
            });

            item.addEventListener('focus', function(e) {
                item.value = item.value.slice(0, -inputUnit.length - 1)
            });

            item.addEventListener('blur', function(e) {
                slider.noUiSlider.updateOptions({}, true);
            });
        });
    };

    rangeEls.forEach(range => {
        const rangeSlider = range.querySelector('.range__slider');

        if (!rangeSlider) return;

        let rangeMinValue = +range.dataset.min;
        let rangeMaxValue = +range.dataset.max;
        let rangeStart = +range.dataset.start;

        noUiSlider.create(rangeSlider, {
            start: rangeStart,
            connect: [true, false],
            range: {
                'min': rangeMinValue,
                'max': rangeMaxValue,
            }
        });

        bindInputs(range, rangeSlider);

    });
}

initRangeInputs();

// modals

function initModals() {

    const modals = [...document.querySelectorAll('.modal')];
    const modalsLinks = [...document.querySelectorAll('.modal-link')];
    
    if (!modals.length || !modalsLinks.length) return;

    function close(el) {
        if(!el) return;

        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        el.style.paddingRight = '';
        el.classList.remove('active');
        el.classList.remove('display');
    }

    function show(el) {
        if(!el) return;

        let scrollbarWidth = getScrollbarWidth();
        document.body.classList.add('modal-open');
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        el.style.paddingRight = `${scrollbarWidth}px`;
        el.classList.add('display')
        setTimeout(() => el.classList.add('active'), 0);
    
    }

    modalsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const curModal = modals.find(item => item.dataset.modal === link.dataset.target);
            show(curModal);
        });
    });

    modals.forEach(item => {
        let modalCloseBtn = item.querySelector('.modal__close');
        let modalWrapper = item.querySelector('.modal__wrapper');

        if(!modalCloseBtn) return;

        modalCloseBtn.addEventListener('click', function() {
            close(item);
        });

        item.addEventListener('click', function(e) {
            if(e.path.indexOf(modalWrapper) < 0) close(item);
        })
    });

}

initModals();

// count numbers

function initCount() {
    const countEls = [...document.querySelectorAll('.count-number-js')];

    if(!countEls) return;

    countEls.forEach(el => {
        let startNr = +el.dataset.start;
        let endNr = +el.dataset.end;    

        el.textContent = startNr;

        const countUp = (count) => {
            el.textContent = count
            
            if(count < endNr) {
                setTimeout(() => countUp(count + 1), 0)
            }
        }

        countUp(startNr);

    });
}
initCount();





