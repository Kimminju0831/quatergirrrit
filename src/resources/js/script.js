// opilsol-N1 [qvLOs5jZ8n]
(function() {
  $(function() {
    $(".opilsol-N1").each(function() {
      const $block = $(this);
      // Header Scroll
      $(window).on("load scroll", function() {
        const $thisTop = $(this).scrollTop();
        if ($thisTop > 0) {
          $block.addClass("block-scroll-active");
        } else {
          $block.removeClass("block-scroll-active");
        }
      });
      // Gnb
      $block.find(".header-center").on("mouseover", function() {
        if (window.innerWidth > 992) {
          $block.addClass("block-active");
        }
      });
      $block.find(".header-center").on("mouseout", function() {
        if (window.innerWidth > 992) {
          $block.removeClass("block-active");
        }
      });
      // Gnb DecoLine
      $block.find(".header-gnbitem").each(function() {
        const $this = $(this);
        $this.on("mouseover", function() {
          if (window.innerWidth > 992) {
            $this.find(".header-gnblink").addClass("on");
          }
        });
        $this.on("mouseout", function() {
          if (window.innerWidth > 992) {
            $this.find(".header-gnblink").removeClass("on");
          }
        });
      });
      // Full Gnb
      $block.find(".btn-allmenu").on("click", function() {
        $block.find(".header-fullmenu").addClass("fullmenu-active");
      });
      $block.find(".fullmenu-close").on("click", function() {
        $block.find(".header-fullmenu").removeClass("fullmenu-active");
      });
      // Full Gnb Search
      $block.find(".btn-search").on("click", function() {
        $block.find(".header-search").addClass("fullmenu-active");
      });
      $block.find(".fullmenu-close").on("click", function() {
        // $block.find(".header-fullmenu").removeClass("fullmenu-active");
        $block.find(".header-search").removeClass("fullmenu-active");
      });
      // Full Gnb DecoLine
      $block.find(".fullmenu-gnbitem").each(function() {
        const $this = $(this);
        $this.on("mouseover", function() {
          if (window.innerWidth > 992) {
            $this.find(".fullmenu-gnblink").addClass("on");
          }
        });
        $this.on("mouseout", function() {
          if (window.innerWidth > 992) {
            $this.find(".fullmenu-gnblink").removeClass("on");
          }
        });
      });
      $block.find(".fullmenu-gnblink").each(function() {
        const $this = $(this);
        $this.on("click", function(e) {
          if (window.innerWidth > 992) {
            e.preventDefault();
          }
          if (window.innerWidth <= 992) {
            $this.toggleClass("on").next(".fullmenu-sublist").slideToggle().closest(".fullmenu-gnbitem").siblings().find(".fullmenu-gnblink").removeClass("on").next(".fullmenu-sublist").slideUp();
          }
        });
      });
    });
    $(window).on({
      resize: function() {
        if ($(window).width() > 992) {
          $(".fullmenu-sublist").slideDown(0);
        }
        if ($(window).width() <= 992) {
          $(".fullmenu-gnblink").removeClass("on").next(".fullmenu-sublist").slideUp(0);
        }
      },
    });
    // Header Mobile 1Depth Click
    if (window.innerWidth <= 992) {
      $block.find(".header-gnbitem").each(function() {
        const $gnblink = $(this).find(".header-gnblink");
        const $sublist = $(this).find(".header-sublist");
        if ($sublist.length) {
          $gnblink.attr("href", "javascript:void(0);");
        }
      });
    }
  });
})();
// opilsol-N4 [aZLOS5jZ9O]
(function() {
  $(".opilsol-N4").each(function() {
    const $block = $(this);
    const el = $(".opilsol-N4 .visual-container .control-wrap");
    const txtBox = $(".opilsol-N4 .visual-swiper .visual-text-box");
    $(function() {
      var visualSwiper = new Swiper(".opilsol-N4 .visual-swiper", {
        speed: 600,
        parallax: true,
        loop: true,
        allowTouchMove: false,
        touchEventsTarget: "wrapper",
        slidesPerView: "auto",
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".opilsol-N4 .visual-swiper .control-wrap .swiper-pagination",
          clickable: "true",
        },
        on: {
          init: function() {
            $(".opilsol-N4 .visual-swiper .control-wrap .pagination_fraction .all").text(("0" + this.loopedSlides).slice(-2));
          },
          slideChangeTransitionStart: function() {
            $(".opilsol-N4 .visual-swiper .control-wrap .pagination_fraction .current").text("0" + (this.realIndex + 1)).slice(-2);
          },
        },
      });
      if ($(".visual-swiper").length > 0) {
        $(window).on({
          load: function() {
            boxHeight();
          },
          resize: function() {
            boxHeight();
          },
          keyup: function(e) {
            if (e.keyCode == 116 || (e.ctrlKey == true && e.keyCode == 82)) {
              boxHeight();
            }
          },
        });
      }
      var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
      if (isMobile) {
        $(".opilsol-N4 .visual-container .pagination_fraction").css({
          top: "-6rem",
        });
        $(".opilsol-N4 .visual-container .control-bottom").css({
          bottom: "-8rem",
        });
      }
      // Swiper Play, Pause Button
      const pauseButton = $block.find(".swiper-button-pause");
      const playButton = $block.find(".swiper-button-play");
      playButton.hide();
      pauseButton.show();
      pauseButton.on("click", function() {
        visualSwiper.autoplay.stop();
        playButton.show();
        pauseButton.hide();
      });
      playButton.on("click", function() {
        visualSwiper.autoplay.start();
        playButton.hide();
        pauseButton.show();
      });
    });

    function boxHeight() {
      const el = $(".opilsol-N4 .visual-container .control-wrap");
      const txtBox = $(".opilsol-N4 .visual-swiper .visual-text-box");
      el.css({
        height: txtBox.height(),
        transition: "all .5s ",
      });
      $(".load").text(el.position().top);
    }
  });
})();
// opilsol-N5 [EglOs5jZAa]
(function() {
  $(function() {
    var swiper = new Swiper(".opilsol-N5 .slide-container", {
      // loop: "true",
      allowTouchMove: false,
      touchEventsTarget: "wrapper",
      navigation: {
        nextEl: ".opilsol-N5 .swiper-button-next",
        prevEl: ".opilsol-N5 .swiper-button-prev",
      },
      /* autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      }, */
      breakpoints: {
        320: {
          slidesPerView: 1.1446,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2.427,
          spaceBetween: 20,
        },
        922: {
          slidesPerView: 3.232,
          spaceBetween: 20,
        },
        1025: {
          slidesPerView: 3.75,
          spaceBetween: 40,
        },
      },
    });
    $(".opilsol-N5 .slide-container .swiper-slide").hover(function() {
      swiper.autoplay.stop();
    }, function() {
      swiper.autoplay.start();
    });
  });
})();
// opilsol-N8 [VIlOs5jZbW]
(function() {
  $(function() {
    var swiper = new Swiper(".opilsol-N8 .slide-container", {
      // loop: "true",
      allowTouchMove: false,
      touchEventsTarget: "wrapper",
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".opilsol-N8 .swiper-button-next",
        prevEl: ".opilsol-N8 .swiper-button-prev",
      },
      breakpoints: {
        360: {
          slidesPerView: 1.1,
          spaceBetween: 20,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 2.3,
          spaceBetween: 20,
        },
        922: {
          slidesPerView: 3.182,
          spaceBetween: 20,
        },
        1025: {
          slidesPerView: 2.75,
          spaceBetween: 30,
        },
      },
    });
    $(".opilsol-N8 .slide-container .swiper-slide").hover(function() {
      swiper.autoplay.stop();
    }, function() {
      swiper.autoplay.start();
    });
  });
})();