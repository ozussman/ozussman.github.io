// Turns the Portfolio and Resume links into expanding in-page viewers.
// Without this script they remain ordinary links that open the PDF.
(function () {
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-viewer]'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function panelFor(toggle) {
    return document.getElementById(toggle.getAttribute('data-viewer'));
  }

  function setOpen(toggle, open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panelFor(toggle).hidden = !open;
  }

  function show(toggle) {
    toggles.forEach(function (other) {
      setOpen(other, other === toggle);
    });
    panelFor(toggle).scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  function hide(toggle) {
    setOpen(toggle, false);
  }

  toggles.forEach(function (toggle) {
    var panel = panelFor(toggle);
    if (!panel) return;

    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-controls', panel.id);
    toggle.setAttribute('aria-expanded', 'false');

    function flip() {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        hide(toggle);
      } else {
        show(toggle);
      }
    }

    toggle.addEventListener('click', function (event) {
      // Let ctrl/cmd/shift/middle-click still open the PDF itself in a new tab.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      flip();
    });

    // Links only activate on Enter; buttons are expected to respond to Space too.
    toggle.addEventListener('keydown', function (event) {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        flip();
      }
    });

    panel.querySelector('.viewer__close').addEventListener('click', function () {
      hide(toggle);
      toggle.focus({ preventScroll: true });
      toggle.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'nearest'
      });
    });
  });
})();
