/*!
 * Treeson theme behaviour, rewritten dependency-free.
 * Ported from the original jQuery-based functions.js: parallax header,
 * mobile navigation toggles, search box hint and the dark-mode toggle.
 */
(function () {
  'use strict';

  /* jQuery's $(window).width()/.height() exclude scrollbars. */
  function viewportWidth() {
    return document.documentElement.clientWidth;
  }
  function viewportHeight() {
    return document.documentElement.clientHeight;
  }

  function animateSlide(el, show, done) {
    if (show) {
      /* reveal before measuring, a display:none element has no height */
      el.style.display = 'block';
    }
    var height = el.offsetHeight;
    el.style.overflow = 'hidden';
    if (show) {
      el.style.height = '0px';
    } else {
      el.style.height = height + 'px';
    }
    var animation = el.animate(
      show
        ? [{ height: '0px', opacity: 0 }, { height: height + 'px', opacity: 1 }]
        : [{ height: height + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: 600, easing: 'ease' }
    );
    animation.onfinish = function () {
      if (show) {
        el.style.height = '';
        el.style.overflow = '';
      }
      done();
    };
  }

  /* Parallax header: cover-size the image, then translate it while scrolling. */

  function parallaxCover(img) {
    var window_height = parseInt(viewportHeight(), 10);
    var window_width = parseInt(viewportWidth(), 10);

    /* the img starts display:none, so rendered size is 0 until init —
       fall back to natural size to keep the cover math deterministic */
    var img_width = Math.round(img.getBoundingClientRect().width) || img.naturalWidth;
    var img_height = Math.round(img.getBoundingClientRect().height) || img.naturalHeight;
    var r_height = parseInt((img_height * window_width) / img_width, 10);

    img.style.height = 'auto';
    img.style.width = 'auto';

    if (r_height < window_height) {
      var width = parseInt((img_width * window_height) / img_height, 10);
      img.style.height = window_height + 'px';
      img.style.width = width + 'px';
    } else {
      img.style.width = window_width + 'px';
      img.style.height = 'auto';
    }
  }

  function updateParallax(container, img, initial) {
    if (initial) {
      /* reveal before measuring: a display:none image has no box, and
         translate must be computed from its real rendered height */
      img.style.display = 'block';
    }

    var window_width = viewportWidth();
    var container_height =
      container.clientHeight > 0 ? container.clientHeight : window_width < 601 ? img.clientHeight : 500;

    var img_height = Math.round(img.getBoundingClientRect().height);
    var parallax_dist = img_height - container_height;
    var top = container.getBoundingClientRect().top + window.scrollY;
    var bottom = top + container_height;
    var scrollTop = window.scrollY;
    var windowHeight = viewportHeight();
    var percentScrolled = (scrollTop + windowHeight - top) / (container_height + windowHeight);
    var parallax = Math.round(parallax_dist * percentScrolled);

    if (bottom > scrollTop && top < scrollTop + windowHeight) {
      img.style.transform = 'translate3d(-50%,' + parallax + 'px, 0)';
    }
  }

  function initParallax() {
    var container = document.querySelector('div.parallax-container .parallax');
    if (!container) {
      return;
    }
    var img = container.querySelector('img');
    if (!img) {
      return;
    }

    var wrapper = document.querySelector('div.parallax-container');

    var start = function () {
      parallaxCover(img);
      updateParallax(wrapper, img, true);
      if (container.animate) {
        container.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease' }).onfinish =
          function () {
            container.style.opacity = '1';
          };
      } else {
        container.style.opacity = '1';
      }
    };

    if (img.complete) {
      start();
    } else {
      img.addEventListener('load', start, { once: true });
    }

    window.addEventListener(
      'scroll',
      function () {
        updateParallax(wrapper, img, false);
      },
      { passive: true }
    );
    window.addEventListener('resize', function () {
      parallaxCover(img);
      updateParallax(wrapper, img, false);
    });
  }

  /* Navigation: submenu +/- markers and the small-device collapse button. */

  function initNavigation() {
    document
      .querySelectorAll('nav.base-nav ul.mythemes-menu li.menu-item-has-children')
      .forEach(function (li) {
        li.insertAdjacentHTML('afterbegin', '<span class="menu-plus"></span>');
      });

    document.querySelectorAll('nav.base-nav ul li span.menu-plus').forEach(function (plus) {
      plus.addEventListener('click', function () {
        var submenus = plus.parentElement.querySelectorAll(':scope > ul');
        if (plus.classList.contains('collapsed')) {
          submenus.forEach(function (ul) {
            animateSlide(ul, false, function () {
              ul.removeAttribute('style');
            });
          });
          plus.classList.remove('collapsed');
        } else {
          plus.classList.add('collapsed');
          submenus.forEach(function (ul) {
            animateSlide(ul, true, function () {});
          });
        }
      });
    });

    document.querySelectorAll('.btn-collapse').forEach(function (button) {
      button.addEventListener('click', function () {
        var collapseAll = function () {
          document.querySelectorAll('.nav-collapse.in').forEach(function (nav) {
            animateSlide(nav, false, function () {
              nav.classList.remove('in');
              nav.removeAttribute('style');
            });
          });
        };

        if (button.classList.contains('collapsed')) {
          button.classList.remove('collapsed');
          collapseAll();
        } else {
          document.querySelectorAll('.btn-collapse').forEach(function (b) {
            b.classList.remove('collapsed');
          });
          button.classList.add('collapsed');
          collapseAll();
          var nav = document.querySelector(button.getAttribute('data-toggle'));
          if (nav) {
            animateSlide(nav, true, function () {
              nav.classList.add('in');
              nav.removeAttribute('style');
            });
          }
        }
      });
    });

    window.addEventListener('resize', function () {
      document.querySelectorAll('nav.base-nav ul span.menu-plus').forEach(function (plus) {
        plus.classList.remove('collapsed');
      });
      document.querySelectorAll('nav.base-nav ul li ul').forEach(function (ul) {
        ul.removeAttribute('style');
      });
    });
  }

  /* Search box hint (replaces the old inline onfocus/onblur attributes). */

  function initSearchHint() {
    var input = document.getElementById('keywords');
    if (!input) {
      return;
    }
    input.addEventListener('focus', function () {
      if (input.value === 'type here...') {
        input.value = '';
      }
    });
    input.addEventListener('blur', function () {
      if (input.value === '') {
        input.value = 'type here...';
      }
    });
  }

  /* Dark-mode toggle. */

  function initThemeToggle() {
    var button = document.getElementById('theme-toggle');
    if (!button) {
      return;
    }
    button.addEventListener('click', function (event) {
      event.preventDefault();
      var root = document.documentElement;
      var theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      try {
        window.localStorage.setItem('sm-theme', theme);
      } catch (err) {
        /* private browsing etc. */
      }
    });
  }

  initParallax();
  initNavigation();
  initSearchHint();
  initThemeToggle();

  /* Code highlighting, loaded only on pages that contain code blocks. */
  if (typeof window.prettyPrint === 'function') {
    window.prettyPrint();
  }
})();
