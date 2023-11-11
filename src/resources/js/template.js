/* ========== */
/* Temha */
(function () {
  // Body
  document.body.addEventListener("click", () => {
    document
      .querySelectorAll(".dropset")
      .forEach((element) => element.classList.remove("active"));
    document
      .querySelectorAll(".selectset")
      .forEach((element) => element.classList.remove("active"));
  });

  // Tabset
  const tabsetLink = document.querySelectorAll(".tabset-link");
  tabsetLink.forEach((buttonElement) => {
    const clickEventHandler = (event) => {
      event.stopPropagation();
      const button = event.target.closest(".tabset-link");
      const buttonGrandParent = button.closest(".tabset-list");
      const buttonParent = button.closest(".tabset-item");
      const buttonParentSiblings = getSiblings(buttonGrandParent, buttonParent);
      const buttonParentIndex = getIndex(buttonParent);
      const itemTabsetContainer = button
        .closest(".tabset")
        .querySelector(".tabset-container");
      buttonParentSiblings.forEach((siblingElement) => {
        siblingElement.querySelector(".tabset-link").classList.remove("active");
      });
      button.classList.add("active");
      if (itemTabsetContainer) {
        itemTabsetContainer
          .querySelectorAll(".tabset-cont")
          .forEach((contElement) => {
            const contElementIndex = getIndex(contElement);
            contElement.classList.remove("active");
            if (contElementIndex === buttonParentIndex) {
              contElement.classList.add("active");
            }
          });
      }
    };
    buttonElement.removeEventListener("click", clickEventHandler);
    buttonElement.addEventListener("click", clickEventHandler);
  });

  // Selectset
  const selectsetToggle = document.querySelectorAll(".selectset-toggle");
  const selectsetLink = document.querySelectorAll(".selectset-link");
  selectsetToggle.forEach((buttonElement) => {
    const clickEventHandler = (event) => {
      event.stopPropagation();
      const button = event.target.closest(".selectset-toggle");
      const buttonParent = button.closest(".selectset");
      buttonParent.classList.toggle("active");
    };
    buttonElement.removeEventListener("click", clickEventHandler);
    buttonElement.addEventListener("click", clickEventHandler);
  });
  selectsetLink.forEach((buttonElement) => {
    const clickEventHandler = (event) => {
      event.stopPropagation();
      const button = event.target.closest(".selectset-link");
      const buttonText = button.querySelector("span").innerHTML;
      const buttonGrandParent = button.closest(".selectset-list");
      const buttonParent = button.closest(".selectset-item");
      const buttonParentSiblings = getSiblings(buttonGrandParent, buttonParent);
      const buttonSelectsetToggle = button
        .closest(".selectset")
        .querySelector(".selectset-toggle");
      buttonParentSiblings.forEach((siblingElement) => {
        siblingElement.querySelector(".selectset-link").classList.remove("on");
      });
      button.classList.toggle("on");
      buttonSelectsetToggle.querySelector("span").innerHTML = buttonText;
    };
    buttonElement.removeEventListener("click", clickEventHandler);
    buttonElement.addEventListener("click", clickEventHandler);
  });

  // Dropset
  const dropsetToggle = document.querySelectorAll(".dropset-toggle");
  dropsetToggle.forEach((buttonElement) => {
    const clickEventHandler = (event) => {
      event.stopPropagation();
      const button = event.target.closest(".dropset-toggle");
      const buttonParent = button.closest(".dropset");
      buttonParent.classList.toggle("active");
    };
    buttonElement.removeEventListener("click", clickEventHandler);
    buttonElement.addEventListener("click", clickEventHandler);
  });

  // Accordset
  const accordsetButton = document.querySelectorAll(".accordset-button");
  accordsetButton.forEach((buttonElement) => {
    const clickEventHandler = (event) => {
      const button = event.target.closest(".accordset-button");
      const buttonGrandParent = button.closest(".accordset");
      const buttonParent = button.closest(".accordset-item");
      const buttonParentSiblings = getSiblings(buttonGrandParent, buttonParent);
      buttonParentSiblings.forEach((siblingElement) => {
        siblingElement.classList.remove("active");
      });
      buttonParent.classList.toggle("active");
    };
    buttonElement.removeEventListener("click", clickEventHandler);
    buttonElement.addEventListener("click", clickEventHandler);
  });

   // Videoset
   const videosetButtons = document.querySelectorAll(".videoset-play");
   videosetButtons.forEach((buttonElement) => {
     const clickEventHandler = (countevent) => {
       const buttonElement = event.target.closest(".videoset").querySelector(".videoset-video");
       const buttonGrandParent = event.target.closest(".videoset");
       buttonElement.play();
       buttonGrandParent.classList.add("active");
       buttonElement.addEventListener("click", () => {
         buttonElement.pause();
         buttonGrandParent.classList.remove("active");
       });
     };
     buttonElement.removeEventListener("click", clickEventHandler);
     buttonElement.addEventListener("click", clickEventHandler);
   });
   
  // Function
  function getSiblings(parent, element) {
    return [...parent.children].filter((item) => item !== element);
  }
  function getIndex(element) {
    return [...element.parentNode.children].indexOf(element);
  }
})();
