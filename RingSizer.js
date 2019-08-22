/* 
  A/B Test
  Ticket: https://alm.swarovski.com/jira/browse/ABTEST-78
*/

function RingSizer() {
    try {
      var screenSize = window.innerWidth;
      var productDetailElement = document.querySelector('.product-detail-wrapper .product-detail__guide');


      if (screenSize <= 1024 || !productDetailElement) {
        return;
      }

      var AVAILABLE_LANGUAGES = ['en']; //, 'de'];

      var TRANSLATIONS = {
        en: {
          findSize: 'FIND YOUR SIZE',
          newFlag: 'NEW',
          start: 'START',
          back: 'BACK',
          nextStep: 'NEXT STEP',
          saveSize: 'SAVE MY SIZE',
          ringSizeOutOfStock: 'Out of stock',
          ringSizeNotAvailable: 'This size is not available',
          slide1: {
            heading: 'How to measure your ring size online',
            instructionOneHeading: '1. Place your creadit card on the screen',
            instructionOneDescription: 'To calibrate your screen place your credit card on the screen as indicated and than click on the plus / minus buttons so that the card fits into the box on the screen.',
            instructionTwoHeading: '2. Place a ring on the screen',
            instructionTwoDescription: 'Use any ring that fits the finger you plan to wear your new ring on and palce it over the circles. Match ring to the circle that compleatly fills the inside of the ring without overlapping. The size written inside the matching circle is your ring size.'
          },
          slide2: {
            heading: 'Place your credit card on the screen bellow.',
            description: 'Adjust the slider with + and - buttons until the size of the picture matches the size of your credit card. This sets the screen at the right dimention so the ring size will be accurate.'
          },
          slide3: {
            heading: 'Place the ring on the circle bellow.',
            description: 'Use the + and - buttons to adjust the slider until the circle fits snugly inside the ring. Hint: A ring that lies flat against the screen will work best.',
            note: 'The estimated ring size appears inside the circle.',
            ringSize: 'SIZE'
          },
        },
        de: {

        } 
      };

      var swarovskiAvailableSizes = [50, 52, 55, 58, 60];
      var swarovskiSizeStaticRatio = 0.315;
      var cardStaticHeight = 53.98;
      var cardDynamicHeight = 0;
      var ringCurrentIndex = 2; // starting index for the value 55
      var cardScale = 1.32; 

      var siteLanguage = document.querySelector('html').getAttribute('lang');
      var usedLanguage = siteLanguage & AVAILABLE_LANGUAGES.includes(siteLanguage) ? siteLanguage : 'en';

      function injectSizerButton() {
        var linkPlaceholder = document.createElement('div');
        linkPlaceholder.className = 'ab-link-placeholder';

        // create button element with link that will trigger the modal
        var ringSizer = document.createElement('button');
        ringSizer.className = 'ab-link-button';
        ringSizer.innerText = TRANSLATIONS[usedLanguage].findSize;
        linkPlaceholder.appendChild(ringSizer);

        // add new flag
        var newFlag = document.createElement('span');
        newFlag.className = 'ab-link-flag';
        newFlag.innerText = TRANSLATIONS[usedLanguage].newFlag;
        linkPlaceholder.appendChild(newFlag);

        // replace original content
        productDetailElement.replaceWith(linkPlaceholder);
        
        return ringSizer;
      }

      // CREATE MODAL
      function createModal() {
        var modal = document.createElement('div');
        modal.setAttribute('data-modal-name', 'ab-test-modal');
        modal.setAttribute('data-modal-dismiss', '');
        modal.className = 'ab-modal';

        var modalDialog = document.createElement('div');
        modalDialog.className = 'ab-modal__dialog';
        modal.appendChild(modalDialog);

        var closeBtn = document.createElement('button');
        closeBtn.className = 'ab-modal__close';
        closeBtn.setAttribute('data-modal-dismiss', '');
        closeBtn.innerHTML = '&#10005;';
        modalDialog.appendChild(closeBtn);

        var backBtn = document.createElement('button');
        backBtn.className = 'slidein-transition ab-modal__back hide';
        backBtn.setAttribute('data-modal-back', '');
        backBtn.innerText = '< ' + TRANSLATIONS[usedLanguage].back;
        modalDialog.appendChild(backBtn);

        var modalContent = document.createElement('div');
        modalContent.className = 'ab-modal__content';
        modalDialog.appendChild(modalContent);

        document.body.appendChild(modal);

        // providing reference to modal content
        return {
          modalRef: modal,
          modalContent: modalContent
        };
      }

      // CREATE NAVIGATION BUBBLES
      function createStepBubbles(target, stepOne, stepTwo) {
        var stepBubbles = document.createElement('div');
        stepBubbles.className = 'checkout-process ab-step-bubbles';
        //stepBubbles.style.cssText = 'margin-bottom: 20px';
        target.appendChild(stepBubbles);

        var stepBubblesPlaceholder = document.createElement('div');
        stepBubblesPlaceholder.className = 'checkout-process__area';
        stepBubbles.appendChild(stepBubblesPlaceholder);

        var linethrough = document.createElement('div');
        linethrough.className = 'checkout-process__line';
        stepBubblesPlaceholder.appendChild(linethrough);

        var firstStepBubble = document.createElement('div');
        firstStepBubble.className = 'form-text--fe15 checkout-process__step' + (stepTwo ? ' outline' : '');
        firstStepBubble.innerText = '1'; // will change to checkmark - &#10003; - ✓
        stepBubblesPlaceholder.appendChild(firstStepBubble);

        var secondStepBubble = document.createElement('div');
        secondStepBubble.className = 'form-text--fe15 checkout-process__step' + (stepOne ? ' outline' : '');
        secondStepBubble.innerText = '2';
        stepBubblesPlaceholder.appendChild(secondStepBubble);
      }

      // CREATE PLUS AND MINIS CONTROLLS
      function createSizeBubbles(target, type) {
        var sizeBubblesPlaceholder = document.createElement('div');
        sizeBubblesPlaceholder.className = 'ab-plus-minus-controlls';
        sizeBubblesPlaceholder.setAttribute('data-modal-' + type, '');

        // plus sign
        var plusBubble = document.createElement('button');
        plusBubble.className = 'ab-plus-button';
        plusBubble.innerText = '+';
        sizeBubblesPlaceholder.appendChild(plusBubble);

        // minus sign
        var minusBubble = document.createElement('button');
        minusBubble.className = 'ab-minus-button';
        minusBubble.innerText = '–';
        sizeBubblesPlaceholder.appendChild(minusBubble);

        target.appendChild(sizeBubblesPlaceholder);
      }
      
      // FIRST SLIDE PAGE
      function createSlideOnePage(modalContentRef) {
        var wrapper = document.createElement('div');
        wrapper.className = 'slidein-transition ab-first-page';
        modalContentRef.appendChild(wrapper);

        var slideOneMainHeading = document.createElement('div');
        slideOneMainHeading.className = 'ab-modal-heading';
        slideOneMainHeading.innerText = TRANSLATIONS[usedLanguage].slide1.heading;
        wrapper.appendChild(slideOneMainHeading);

        // child elements here need to be of inline-block type
        var slideOneFirstRowContainer = document.createElement('div');
        slideOneFirstRowContainer.className = 'ab-slide-row-container';
        wrapper.appendChild(slideOneFirstRowContainer);

        // 1/2
        var slideOneFirstImagePlacehorder = document.createElement('div');
        slideOneFirstImagePlacehorder.className = 'ab-first-slide-image-placeholder';
        slideOneFirstRowContainer.appendChild(slideOneFirstImagePlacehorder);

        var slideOneFirstImage = document.createElement('div');
        slideOneFirstImage.className = 'ab-first-slide-image';
        slideOneFirstImagePlacehorder.appendChild(slideOneFirstImage);

        // 2/2
        var slideOneFirstInstructionPlaceholder = document.createElement('div');
        slideOneFirstInstructionPlaceholder.className = 'ab-first-slide-insturction';
        slideOneFirstRowContainer.appendChild(slideOneFirstInstructionPlaceholder);

        var slideOneFirstInstructionHeading = document.createElement('p');
        slideOneFirstInstructionHeading.innerText = TRANSLATIONS[usedLanguage].slide1.instructionOneHeading;
        slideOneFirstInstructionPlaceholder.appendChild(slideOneFirstInstructionHeading);

        var slideOneFirstInstruction = document.createElement('p');
        slideOneFirstInstruction.innerText = TRANSLATIONS[usedLanguage].slide1.instructionOneDescription;
        slideOneFirstInstructionPlaceholder.appendChild(slideOneFirstInstruction);

        clearFix(slideOneFirstRowContainer);

        // child elements here need to be of inline-block type
        var slideOneSecondRowContainer = document.createElement('div');
        slideOneSecondRowContainer.className = 'ab-slide-row-container';
        wrapper.appendChild(slideOneSecondRowContainer);

        // 1/2
        var slideOneSecondImagePlaceholder = document.createElement('div');
        slideOneSecondImagePlaceholder.className = 'ab-first-slide-image-placeholder';
        slideOneSecondRowContainer.appendChild(slideOneSecondImagePlaceholder);

        var slideOneSecondImage = document.createElement('div');
        slideOneSecondImage.className = 'ab-first-slide-image';
        slideOneSecondImagePlaceholder.appendChild(slideOneSecondImage);

        // 2/2
        var slideOneSecondInstructionPlaceholder = document.createElement('div');
        slideOneSecondInstructionPlaceholder.className = 'ab-first-slide-insturction';
        slideOneSecondRowContainer.appendChild(slideOneSecondInstructionPlaceholder);

        var slideOneSecondInstructionHeading = document.createElement('p');
        slideOneSecondInstructionHeading.innerText = TRANSLATIONS[usedLanguage].slide1.instructionTwoHeading;
        slideOneSecondInstructionPlaceholder.appendChild(slideOneSecondInstructionHeading);

        var slideOneSecondInstruction = document.createElement('p');
        slideOneSecondInstruction.innerText = TRANSLATIONS[usedLanguage].slide1.instructionTwoDescription;
        slideOneSecondInstructionPlaceholder.appendChild(slideOneSecondInstruction);

        clearFix(slideOneSecondRowContainer);

        var buttonPlaceholder = document.createElement('div');
        buttonPlaceholder.className = 'text-center';
        wrapper.appendChild(buttonPlaceholder);

        var button = document.createElement('button');
        button.className = 'ab-modal-button js-start-button';
        button.innerText = TRANSLATIONS[usedLanguage].start;
        buttonPlaceholder.appendChild(button);

        return wrapper;
      }


      // SECOND SLIDE PAGE
      function createSlideTwoPage(modalContentRef) {
        var wrapper = document.createElement('div');
        wrapper.className = 'slidein-transition ab-second-page hide';
        modalContentRef.appendChild(wrapper);
        
        // show bubbles
        var bubblesPlaceholder = document.createElement('div');
        bubblesPlaceholder.className = 'text-center';
        createStepBubbles(bubblesPlaceholder, true, false);
        wrapper.appendChild(bubblesPlaceholder);

        // add heading
        var slideTwoMainHeading = document.createElement('div');
        slideTwoMainHeading.className = 'text-center ab-font-22';
        slideTwoMainHeading.innerText = TRANSLATIONS[usedLanguage].slide2.heading;
        wrapper.appendChild(slideTwoMainHeading);

        // add description
        var slideTwoInstructionPlaceholder = document.createElement('div');
        slideTwoInstructionPlaceholder.className = 'text-center';
        slideTwoInstructionPlaceholder.style.cssText = 'padding: 20px 120px';
        slideTwoInstructionPlaceholder.innerText = TRANSLATIONS[usedLanguage].slide2.description;
        wrapper.appendChild(slideTwoInstructionPlaceholder);

        // add credit card placeholder
        var slideTwoCreditCardPlaceholder = document.createElement('div');
        slideTwoCreditCardPlaceholder.className = 'ab-cc-sizing';
        wrapper.appendChild(slideTwoCreditCardPlaceholder);

        //  ------ ------
        // | div1 | div2 |
        //  ------ ------
        // first column
        var creditCardLeftContainer = document.createElement('div');
        creditCardLeftContainer.className = '';
        creditCardLeftContainer.style.cssText = '';
        slideTwoCreditCardPlaceholder.appendChild(creditCardLeftContainer);

        // second column
        var creditCardRightContainer = document.createElement('div');
        creditCardRightContainer.className = '';
        creditCardRightContainer.style.cssText = '';
        slideTwoCreditCardPlaceholder.appendChild(creditCardRightContainer);

        var ccCard = document.createElement('div'); // deep magic needed here
        ccCard.className = 'ab-cc-card';
        ccCard.style.cssText = 'transform-origin: left bottom 0px; transform: matrix(1.32, 0, 0, 1.32, 0, 0)';
        // more magic need here
        creditCardLeftContainer.appendChild(ccCard);

        var ccTemplate = document.createElement('div');
        ccTemplate.className = 'ab-cc-template';
        ccTemplate.style.cssText = 'transform-origin: left bottom 0px; transform: matrix(1.32, 0, 0, 1.32, 0, 0)';
        // light magic needed (what should we doo with images)
        creditCardLeftContainer.appendChild(ccTemplate);

        // create and append plus and minus buttons
        createSizeBubbles(creditCardRightContainer, 'cc');

        var buttonPlaceholder = document.createElement('div');
        buttonPlaceholder.className = 'text-center';
        buttonPlaceholder.style.cssText = 'position: relative; top: 100px';
        wrapper.appendChild(buttonPlaceholder);

        var button = document.createElement('button');
        button.className = 'ab-modal-button js-next-step-button';
        button.innerText = TRANSLATIONS[usedLanguage].nextStep;
        buttonPlaceholder.appendChild(button);

        return wrapper;
      }

      // THIRD SLIDE PAGE
      function createSlideThreePage(modalContentRef) {

        var wrapper = document.createElement('div');
        wrapper.className = 'slidein-transition ab-third-page hide';
        modalContentRef.appendChild(wrapper);

        // show bubbles
        var bubblesPlaceholder = document.createElement('div');
        bubblesPlaceholder.className = 'text-center';
        createStepBubbles(bubblesPlaceholder, false, true);
        wrapper.appendChild(bubblesPlaceholder);

        // add heading
        var slideThreeMainHeading = document.createElement('div');
        slideThreeMainHeading.className = 'text-center ab-font-22';
        slideThreeMainHeading.innerText = TRANSLATIONS[usedLanguage].slide3.heading;
        wrapper.appendChild(slideThreeMainHeading);

        // add description
        var slideThreeInstructionPlaceholder = document.createElement('div');
        slideThreeInstructionPlaceholder.className = 'text-center';
        slideThreeInstructionPlaceholder.style.cssText = 'padding: 15px 145px 10px';
        slideThreeInstructionPlaceholder.innerText = TRANSLATIONS[usedLanguage].slide3.description;
        wrapper.appendChild(slideThreeInstructionPlaceholder);
        
        // add helper note
        var slideThreeNotePlaceholder = document.createElement('div');
        slideThreeNotePlaceholder.className = 'text-center';
        slideThreeNotePlaceholder.style.cssText = 'margin: 15px 0';
        slideThreeNotePlaceholder.innerText = TRANSLATIONS[usedLanguage].slide3.note;
        wrapper.appendChild(slideThreeNotePlaceholder);

        // create ring size here
        var slideThreeRingSizePlaceholder = document.createElement('div');
        slideThreeRingSizePlaceholder.className = 'ab-ring-placeholder';
        wrapper.appendChild(slideThreeRingSizePlaceholder);

        //  ------ ------
        // | div1 | div2 |
        //  ------ ------
        // first column
        var ringSizeLeftContainer = document.createElement('div');
        ringSizeLeftContainer.className = '';
        ringSizeLeftContainer.style.cssText = '';
        slideThreeRingSizePlaceholder.appendChild(ringSizeLeftContainer);

        // second column
        var rignSizeRightContainer = document.createElement('div');
        rignSizeRightContainer.className = '';
        rignSizeRightContainer.style.cssText = '';
        slideThreeRingSizePlaceholder.appendChild(rignSizeRightContainer);
        
        var ringSizeTemplate = document.createElement('div');
        ringSizeTemplate.className = 'ab-ring-size-template';
        ringSizeTemplate.style.cssText = 'width: 165px; height: 165px; background-color: #fafafa; border: 2px  dashed #e2e2e2; border-radius: 50%; margin: 20px auto';
        ringSizeLeftContainer.appendChild(ringSizeTemplate);

        var ringSize = document.createElement('div');
        ringSize.className = 'ab-ring-size';
        ringSize.style.cssText = 'width: 80px; height: 80px; background-color: #fff; border: 2px solid #231262; border-radius: 50%; position: absolute; top: 26%; right: 25%'
        ringSizeLeftContainer.appendChild(ringSize);

        var ringSizeText = document.createElement('div');
        ringSizeText.className = 'ab-ring-size-text';
        ringSizeText.style.cssText = 'font-size: 12px; font-family: FuturaLig; color: rgb(35, 18, 98); position: absolute; right: 43%; top: 37%;';
        ringSizeText.innerText = TRANSLATIONS['en'].slide3.ringSize;
        ringSizeLeftContainer.appendChild(ringSizeText);

        var ringSizeNumber = document.createElement('div');
        ringSizeNumber.className = 'ab-ring-size-number';
        ringSizeNumber.innerText = '55';
        ringSizeLeftContainer.appendChild(ringSizeNumber);

        // create and append plus and minus buttons
        createSizeBubbles(rignSizeRightContainer, 'ring');

        var buttonPlaceholder = document.createElement('div');
        buttonPlaceholder.style.cssText = 'text-align: center';
        wrapper.appendChild(buttonPlaceholder);

        var notification = document.createElement('div');
        notification.className = 'ab-modal-notification hide';
        buttonPlaceholder.appendChild(notification);

        var button = document.createElement('button');
        button.className = 'ab-modal-button js-save-my-size-button';
        button.innerText = TRANSLATIONS[usedLanguage].saveSize;
        buttonPlaceholder.appendChild(button);

        return wrapper;
      }

      function showModal(modalRef) {
        modalRef.classList.add('ab-is-modal-active')
      }

      function dissmissModal(modalRef, callback) {
        modalRef.querySelector('[data-modal-dismiss]').addEventListener('click', function() {
          modalRef.classList.remove('ab-is-modal-active');
          callback(modalRef);
        });
      }

      function sliderPageNavigationHandler(sliderOne, sliderTwo, sliderThree, modalRef) {

        // set event listener on START and and once it is clicked it should switch to slide 2 (slide 1 and slide 3 should be hidden now)
        sliderOne.querySelector('.js-start-button').addEventListener('click', function() {
          sliderOne.classList.add('hide');
          sliderTwo.classList.add('slidein-from-right');
          sliderTwo.classList.remove('hide');
        });

        sliderTwo.querySelector('.js-next-step-button').addEventListener('click', function() {
          cardDynamicHeight = getCardHeight();

          sliderTwo.classList.add('hide');
          sliderThree.classList.add('slidein-from-right');
          sliderThree.classList.remove('hide');
          modalRef.querySelector('[data-modal-back]').classList.remove('hide');

          setRingSize();
        })

        modalRef.querySelector('[data-modal-back]').addEventListener('click', function() {
          sliderThree.classList.add('hide');
          sliderTwo.classList.add('slidein-from-left');
          sliderTwo.classList.remove('hide');
          this.classList.add('hide');
        });


        // Save my size functionality
        sliderThree.querySelector('.js-save-my-size-button').addEventListener('click', function() {
          saveMySize();
        });
      }

      function plusMinusEventHandler(sliderTwo, sliderThree) {
        sliderTwo.querySelector('.ab-plus-button').addEventListener('click', scaleCardUp);
        sliderTwo.querySelector('.ab-minus-button').addEventListener('click', scaleCardDown);

        sliderThree.querySelector('.ab-plus-button').addEventListener('click', scaleRingUp);
        sliderThree.querySelector('.ab-minus-button').addEventListener('click', scaleRingDown);
      }

      function saveMySize() {
        var selectDropdown = document.querySelector('.js-product-add-to-cart-components select');

        // select dropdown from page and select size
        selectDropdown.querySelectorAll('option').forEach(function(elem) {
          if (parseInt(elem.text.substring(0, 2), 10) === swarovskiAvailableSizes[ringCurrentIndex]) {
            selectDropdown.value = elem.value;

            var event = document.createEvent('Event');
            event.initEvent('change', false, true);
            selectDropdown.dispatchEvent(event);
          }
        });
      }

      // HELPER FUNCTIONS

      // fix for floating elements
      function clearFix(target) {
        var clearFix = document.createElement('div');
        clearFix.className = 'clearfix';
        target.appendChild(clearFix);
      }

      function resetModalPage(modalRef) {
        var modal = modalRef.querySelectorAll('.ab-modal__content > .slidein-transition');
        
        // hiding all slides
        modal.forEach(function(elem) {
          elem.classList.add('hide');
          elem.classList.remove('slidein-from-right');
          elem.classList.remove('slidein-from-left');
        });

        // showing only first slide
        modal[0].classList.remove('hide');

        // hide back button
        modalRef.querySelector('[data-modal-back]').classList.add('hide');
      }

      function getAvailableRingSizes() {
        var sizesFormated = [];

        var availableSizes = document.querySelectorAll('.js-product-add-to-cart-components select > option');
        availableSizes.forEach(function(elem) {
          var sizeNumber = parseInt(elem.text.substring(0, 2), 10);
          if (sizeNumber) {
            sizesFormated.push(
              {
                size: sizeNumber,
                isOutOfStock: !elem.className.indexOf('out-of-stock')
              });
          }
        });

        return sizesFormated;
      }

      function scaleCardUp() {
        var cardMax = getCardHeight();
        if (cardMax < 400) {
          cardScale += 0.02;
          document.querySelector('.ab-modal__content .ab-cc-card').style.transform = 'matrix(' + cardScale + ', 0, 0, ' + cardScale + ',0, 0)';
        }
      }

      function scaleCardDown() {
        var cardMin = getCardHeight();
        if (cardMin > 100) {
          cardScale -= 0.02;
          document.querySelector('.ab-modal__content .ab-cc-card').style.transform = 'matrix(' + cardScale + ', 0, 0, ' + cardScale + ',0, 0)';
        }
      }

      function getCardHeight() {
        var creditCard = document.querySelector('.ab-modal__content .ab-cc-card');
        var creditCardRect = creditCard.getBoundingClientRect();
        var creditCardHeight = creditCardRect.bottom - creditCardRect.top;
        
        return creditCardHeight.toFixed(0);
      }

      function scaleRingUp() {
        if (ringCurrentIndex < (swarovskiAvailableSizes.length - 1 )) {
          ringCurrentIndex++;
          setRingSize();
        }
      }

      function scaleRingDown() {
        if (ringCurrentIndex > 0) {
          ringCurrentIndex--;
          setRingSize();
        }
      }

      function setRingSize() {
        var cardRatio = cardDynamicHeight / cardStaticHeight;
        var ringDiameter = (cardRatio * (swarovskiAvailableSizes[ringCurrentIndex] * swarovskiSizeStaticRatio));

        // set width and height of the ring
        var ringSizeElement = document.querySelector('.ab-ring-size');
        ringSizeElement.style.width = ringDiameter + 'px';
        ringSizeElement.style.height = ringDiameter + 'px';

        // offset fix for ring size to be center
        ringSizeElement.style.top = 'calc((165px - ' + ringDiameter + 'px) / 2)';
        ringSizeElement.style.right = 'calc((165px - ' + ringDiameter + 'px) / 2)';

        // set number inside the ring
        var ringInnerSizeNumber = document.querySelector('.ab-ring-size-number');
        ringInnerSizeNumber.innerText = swarovskiAvailableSizes[ringCurrentIndex];

        // check if ring size is available and show message
        isRingSizeAvailable();
      }

      function isRingSizeAvailable() {
        var availableRingSizes = getAvailableRingSizes();
        var sizeIsNotAvailable = true;

        availableRingSizes.forEach(function(ringSize) {
          if (ringSize.size == swarovskiAvailableSizes[ringCurrentIndex]) {
            // size available
            if (ringSize.isOutOfStock) {
              ringUnavailable(TRANSLATIONS[usedLanguage].ringSizeOutOfStock)

            } else {
              ringAvailable();
            }
            enableSaveButton();

            sizeIsNotAvailable = false;
          }
          
          if (sizeIsNotAvailable) {
            ringUnavailable(TRANSLATIONS[usedLanguage].ringSizeNotAvailable);
            disableSaveButton();
          }

        });
      }

      function ringUnavailable(message) {
        var modalNotification = document.querySelector('.ab-modal-notification');
        modalNotification.classList.remove('hide');
        modalNotification.innerText = message;
      }

      function ringAvailable() {
        var modalNotification = document.querySelector('.ab-modal-notification');
        modalNotification.classList.add('hide');
        modalNotification.innerText = '';
      }

      function disableSaveButton() {
        var saveButton = document.querySelector('.ab-third-page .js-save-my-size-button');
        saveButton.classList.add('disable');
        saveButton.setAttribute('disabled', '');
      }

      function enableSaveButton() {
        var saveButton = document.querySelector('.ab-third-page .js-save-my-size-button');
        saveButton.classList.remove('disable');
        saveButton.removeAttribute('disabled');
      }

      // inject css
      function injectStyleDefinitions() {
        var css = '',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        css += ".ab-link-placeholder {margin: 15px 0} .ab-link-button {border-bottom: 1px solid black; font-size: 14px; cursor: pointer} .ab-link-flag {background-color: #231161; color: #fff; padding: 2px 4px; font-size: 8px; position: absolute; margin-left: 5px}"
        css += ".ab-slide-row-container {padding: 10px 30px} .ab-first-slide-image-placeholder {display: inline-block; float: left} .ab-first-slide-image {background-image: url('https://media.swarovski.com/pd/Step_2_Ring.png'); background-size: cover; background-color: #eee; width: 250px; height: 160px} .ab-first-slide-insturction {display: inline-block; float: left; max-width: 415px; margin-left: 40px; padding: 5px 20px 0} .ab-slide-row-container:nth-of-type(2) .ab-first-slide-image { background-image: url('https://media.swarovski.com/pd/Step_1_Credit_Card.png'); }"
        css += ".ab-modal {display: none; position: fixed; top: 0; right: 0; bottom: 0; left: 0; padding: 15px; overflow: auto; background-color: rgba(0, 0, 0, 0.88); animation-duration: .35s; animation-fill-mode: both; animation-name: fadeIn; z-index: 1001}";
        css += ".ab-modal__dialog {position: relative; padding: 20px; margin: auto; border-radius: 4px; background-color: #fff; width: 960px; height: 690px; overflow: hidden; display:flex; align-items: center;}";
        css += ".ab-modal__close {position: absolute; font-size: 18px; top: 20px; right: 20px; padding: 0; border: none; background-color: transparent; background-image: none; cursor: pointer}; .ab-modal__close:focus {outline: 0}";
        css += ".ab-modal__back {position: absolute; font-size: 14px; top: 25px; left: 20px; padding: 0; border: none; background-color: transparent; background-image: none; cursor: pointer}; .ab-modal__back:focus {outline: 0}";
        css += ".ab-modal__content {padding: 10px 0; font-size: 13px; line-height: 1.6; color: #555; margin: 0 auto;}";
        css += ".ab-is-modal-active {display: flex}";
        css += ".ab-step-bubbles {margin-bottom: 20px}";
        css += ".ab-cc-sizing {position: relative; float: none; width: 685px; margin: 0 auto 0; top: 90px}";
        css += ".ab-cc-card {position: absolute; bottom: 0; left: 0; height: 160px; width: 255px; background-image: url('https://media.swarovski.com/pd/Credit_Card.svg'); background-repeat: no-repeat; background-size: 100% 100%; z-index: 10}";
        css += ".ab-cc-template {height: 287px; width: 456px; background-image: url('https://media.swarovski.com/pd/CC_Background.svg'); background-position: top left; background-repeat: no-repeat}";
        css += ".ab-ring-placeholder {position: relative; float: none; width: 165px; margin: 0 auto} .ab-ring-size-template {width: 165px; height: 165px; background-color: #fafafa; border: 2px  dashed #e2e2e2; border-radius: 50%; margin: 20px auto} .ab-ring-size {width: 80px; height: 80px; background-color: #fff; border: 2px solid #231262; border-radius: 50%; position: absolute; top: 26%; right: 25%} .ab-ring-size-text {font-size: 12px; font-family: FuturaLig; color: rgb(35, 18, 98); position: absolute; right: 43%; top: 37%} .ab-ring-size-number {font-size: 18px; color: #231262; position: absolute; right: 43%; top: 44%}";
        css += ".slidein-transition { -moz-animation: fadein 500ms ease-in; -webkit-animation: fadein 500ms ease-in; -o-animation: fadein 500ms ease-in; animation: fadein 500ms ease-in; } @-webkit-keyframes fadein { from { opacity: 0; } to { opacity: 1; } } @-moz-keyframes fadein { from { opacity: 0; } to { opacity: 1; } } @-o-keyframes fadein { from { opacity: 0; } to { opacity: 1; } } @keyframes fadein { from { opacity: 0; } to { opacity: 1; } } .slidein-from-right { -moz-animation: slidein-from-right2 500ms; -webkit-animation: slidein-from-right2 500ms; -o-animation: slidein-from-right2 500ms; animation: slidein-from-right2 500ms; } @-webkit-keyframes slidein-from-right2 { from { -webkit-transform:translateX(100%); } to { -webkit-transform:translateX(0%); } } @-moz-keyframes slidein-from-right2 { from { -moz-transform:translateX(100%); } to { -moz-transform:translateX(0%); } } @-o-keyframes slidein-from-right2 { from { -o-transform:translateX(100%); } to { -o-transform:translateX(0%); } } @keyframes slidein-from-right2 { from { transform:translateX(100%); } to { transform:translateX(0%); } } .slidein-from-left { -webkit-animation: slidein-from-left2 500ms; -moz-animation: slidein-from-left2 500ms; -o-animation: slidein-from-left2 500ms; animation: slidein-from-left2 500ms; } @-webkit-keyframes slidein-from-left2 { from { -webkit-transform:translateX(-100%); } to { -webkit-transform:translateX(0%); } } @-moz-keyframes slidein-from-left2 { from { -moz-transform:translateX(-100%); } to { -moz-transform:translateX(0%); } } @-o-keyframes slidein-from-left2 { from { -o-transform:translateX(-100%); } to { -o-transform:translateX(0%); } } @keyframes slidein-from-left2 { from { transform:translateX(-100%); } to { transform:translateX(0%); } }";
        css += ".ab-plus-minus-controlls {position: absolute; font-size: 20px} ";
        css += ".ab-plus-button {background: #231262; border-radius: 50%; color: #fff; display: block; height: 48px; width: 48px}";
        css += ".ab-minus-button {background: #231262; border-radius: 50%; color: #fff; display: block; margin-top: 20px; line-height: normal; height: 48px; width: 48px}";
        css += ".ab-first-page {}";
        css += ".ab-second-page {height: 630px} .ab-second-page .ab-plus-minus-controlls {top: 40px; left: 640px}";
        css += ".ab-third-page {} .ab-third-page .ab-plus-minus-controlls {right: -80px; top: 20px}";
        css += ".ab-modal-heading {font-size: 36px; text-align: center}";
        css += ".ab-modal-button {border: 2px solid #091665; color: #091665; padding: 10px 70px; display: inline-block; font-size: 14px; margin-top: 15px; cursor: pointer} .ab-modal-button:hover {color: #fff; background-color: #091665}";
        css += ".js-save-my-size-button {} .js-save-my-size-button.disable {background-color: #b8b7b6; border-color: #b8b7b6; color: #fff}";
        css += ".ab-font-22 {font-size: 22px}";

        head.appendChild(style);
      
        style.type = 'text/css';
        if (style.styleSheet) {
          // This is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }

      function init() {
        var modal = createModal();
        var sliderOne = createSlideOnePage(modal.modalContent);
        var sliderTwo = createSlideTwoPage(modal.modalContent);
        var sliderThree = createSlideThreePage(modal.modalContent);

        injectStyleDefinitions();

        // create slider events for changing the page and hide other
        sliderPageNavigationHandler(sliderOne, sliderTwo, sliderThree, modal.modalRef);

        // create btn for trigerring modal
        injectSizerButton().addEventListener('click', function() {
          showModal(modal.modalRef);
        });

        // bind close btn
        dissmissModal(modal.modalRef, resetModalPage);

        // bind plus / minus buttons
        plusMinusEventHandler(sliderTwo, sliderThree);
      }

      init();

    } catch (e) {
      dataLayer.push({
        event: 'caughtError',
        errorType: 'TBD',
        errorMsg: e
      });
    }
  };