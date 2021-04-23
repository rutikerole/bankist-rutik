'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector  ('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();                    // prevent default is use for avoid some default  method in js
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};


const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////////////////////////////
// SCROLLING
btnScrollTo.addEventListener('click', function(e){
  section1.scrollIntoView({behavior:'smooth'});
});
  



///////////////////////////////////////
// PAGE NAVIGATION

 /*
 // 1. Common Method (in this method each time one copy is created)
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href');  // if we click any nav button they give their SECTION--
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  });
});*/


// 2. event delagation
 // step 1 : add event listner to common parent element
 // step 2 : determinie what element the originated the event
 document.querySelector('.nav__links').addEventListener('click', function(e){
   e.preventDefault();
   if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');  
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});



//////////////////////////////////////////
// Tabbed Components

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

// Guard class
if(!clicked) return;

// Remove active classes
tabs.forEach(t => t.classList.remove('operations__tab--active'));
tabsContent.forEach(c => c.classList.remove('operations__content--active'));

// Activate Tab
clicked.classList.add('operations__tab--active');

// Activate Content Area
document.querySelector(`.operations__content--${clicked.dataset.tab}`)
.classList.add('operations__content--active');

});





///////////////////////////////////////
// Menu Fade Animation.

 const handleHover = function(e){
   if(e.target.classList.contains('nav__link')){
     const link = e.target;
     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
     const logo = link.closest('.nav').querySelector('img');

     siblings.forEach(el => {
       if (el !== link) el.style.opacity = this;    // this = e.currentTarget
     });
     logo.style.opacity = this;
   }
 };

 nav.addEventListener('mouseover', handleHover.bind(0.5));
 nav.addEventListener('mouseout', handleHover.bind(1));




///////////////////////////////////////
// Sticky Navigation : Intersection Observer API
//step 1 : create OBSERVER in it pass function (obsCallback) and object (obsOption)
//step 2 : function(entries, observer)
//step 3 : object {root : , threshold: }

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};


const headerObserver = new IntersectionObserver(stickyNav, {
  root : null,
  threshold : 0,
  rootMargin : `-${navHeight}px`,
});

headerObserver.observe(header);




//////////////////////////////////////////////
//Reavel section animation
const allSections = document.querySelectorAll('.section');

const reavelSection = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(reavelSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});





//////////////////////////////////////////////////
// Lazy loading img

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  // replace src with data src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function(){
      entry.target.classList.remove('lazy-img');
    });

  observer.unobserve(entry.target);  
  };

const imgObserver = new IntersectionObserver(loadImg,{
  root: null,
  threshold: 0,
  rootMargin: '200px',     // its for shown blur to clear 
});

imgTargets.forEach(img => imgObserver.observe(img));



///////////////////////////////////////////////////
// Slider
const slider = function(){

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
 
let curSlide = 0;
const maxSlide =slides.length;

//1. FUNCTIONS

//Create Dots
const createDots = function(){
  slides.forEach(function (_, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};


// Active Dots
const activateDot = function (slide){
  document.querySelectorAll('.dots__dot')
  .forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList.add('dots__dot--active')
};


//slide show
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};


// Next Slide
const nextSlide = function (){
  if (curSlide === maxSlide - 1){
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// previous slide
const prevSlide = function (){
  if (curSlide === 0){
    curSlide = maxSlide - 1;
  }else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}
init()

//2. EVENTHANDLERS

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
 

// keyboard arrow
document.addEventListener('keydown',function (e){
  if(e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});


// make dots working
dotContainer.addEventListener('click', function(e){
  if (e.target.classList.contains('dots__dot')){
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(Slide);
  }
});

}; slider();

