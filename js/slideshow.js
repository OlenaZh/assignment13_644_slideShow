// REWRITTEN TO TAKE ADVANTAGE OF CLOSURES
const $ =  function (id) {
    return document.getElementById(id);
};

const createSlideshow = function () {
    // PRIVATE VARIABLES AND FUNCTIONS
    let timer;
    let speed = 2000;
    let play = true;
    
    let nodes = { image: null, caption: null };
    let img = { cache: [], counter: 0 };
    
    const stopSlideShow = function () {
        clearInterval(timer);
    };
    const displayNextImage = function () {
        if (img.counter === img.cache.length -1) {
            img.counter = 0;
        } else {
            img.counter += 1;
        }
        let image = img.cache[img.counter];
        nodes.image.src = image.src;
        nodes.caption.innerHTML = image.title;
    };
    const setPlayText = function (btn) {
        if (play) {
            btn.value = 'Resume';
        } else {
            btn.value = 'Pause';
        }
    };
    // PUBLIC METHODS THAT HAVE ACCESS TO PRIVATE VARIABLES AND FUNCTIONS
    return {
        getSpeed: function () {
            return speed;
        },
        setSpeed: function (promptSpeed) {
            speed = promptSpeed;
            return this;
        },
        loadImages: function (slides) {
            var image;
            for (let i = 0; i < slides.length; i+=1) {
                image = new Image();
                image.src = slides[i].href;
                image.title = slides[i].title;
                img.cache.push(image);
            }
            return this;
        },
        startSlideShow: function () {
            if (arguments.length === 2) {
                nodes.image = arguments[0];
                nodes.caption = arguments[1];
            }
            if (timer) {
                stopSlideShow();
            }
            timer = setInterval(displayNextImage, speed);
            return this;
        },
        createToggleHandler: function () {
            let me = this;
            // CLOSURE TO BE USED AS THE CLICK EVENT HANDLER
            return function () {
                // 'THIS' IS THE CLICKED BUTTON
                // 'ME' IS THE OBJECT LITERAL
                if (play) {
                    stopSlideShow();
                } else {
                    me.startSlideShow();
                }
                setPlayText(this);
                // TOGGLE PLAY 'FLAG'
                play = !play;
            };
        }
    };
};

// CREATE THE SLIDESHOW OBJECT
const slideshow = createSlideshow();

window.addEventListener('load', function () {
    const slides = [
        {href: 'images/backpack.jpg', title: 'He backpacks in the Sierras often'},
        {href: 'images/boat.jpg', title: 'He loves his boat'},
        {href: 'images/camaro.jpg', title: 'He loves his Camaro more'},
        {href: 'images/punk.jpg', title: 'He used to be in a punk band and toured with No Doubt and Sublime'},
        {href: 'images/race.jpg', title: 'He\'s active and loves obstacle coarse racing'}
    ];
	// START THE SLIDESHOW
    slideshow.loadImages(slides).startSlideShow($('image'), $('caption'));
    // PAUSE THE SLIDESHOW
    $('play_pause').onclick = slideshow.createToggleHandler();

    $('speed').addEventListener('click', () => {
        let promptSpeed = parseInt(prompt('The current speed is ' + slideshow.getSpeed() + ' milliseconds. Please enter new speed'), 10);

        if (promptSpeed < 0 || isNaN(promptSpeed)) {
            prompt('Please enter a valid value fpr speed');
            return false;
        }
        slideshow.setSpeed(promptSpeed).startSlideShow();
    });
});