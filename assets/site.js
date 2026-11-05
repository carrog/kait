// 모바일 메뉴: 항목을 누르면 닫기
document.querySelectorAll('.menu-toggle a').forEach(function (a) {
  a.addEventListener('click', function () { a.closest('.menu-toggle').removeAttribute('open'); });
});

// 탭: 주소의 #값으로 바로 열 수 있습니다 (자료실)
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    var search = document.querySelector('[data-search]');
    if (search) { search.value = ''; search.dispatchEvent(new Event('input')); }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      select(tab);
      history.replaceState(null, '', '#' + tab.dataset.hash);
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
  var fromHash = tabs.filter(function (t) { return t.dataset.hash === location.hash.slice(1); })[0];
  select(fromHash || tabs[0]);
})();

// 현재 보이는 목록에서 검색 (자료실)
(function () {
  var input = document.querySelector('[data-search]');
  if (!input) return;
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    document.querySelectorAll('[role="tabpanel"]:not([hidden])').forEach(function (panel) {
      var shown = 0;
      panel.querySelectorAll('[data-item]').forEach(function (item) {
        var hit = !q || item.textContent.toLowerCase().indexOf(q) > -1;
        item.hidden = !hit;
        item.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      var empty = panel.querySelector('.empty');
      if (empty) empty.hidden = shown > 0;
      var pager = panel.querySelector('.pager');
      if (pager) pager.hidden = !!q;
    });
  });
})();

// 상담 폼 확인 (시안 전용: 전송하지 않음)
(function () {
  var form = document.getElementById('consult-full');
  if (!form) return;
  function setError(field, msg) {
    var el = document.getElementById(field.name + '-error');
    el.textContent = msg;
    if (field.type !== 'checkbox' && field.type !== 'radio') {
      if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
    }
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    function check(field, ok, msg) {
      setError(field, ok ? '' : msg);
      if (!ok && !first) first = field;
    }
    check(form.elements.name, form.elements.name.value.trim(), '성함을 입력해 주세요.');
    check(form.elements.tel, /^[0-9\-\s]{9,}$/.test(form.elements.tel.value.trim()), '연락받으실 전화번호를 입력해 주세요.');
    check(form.elements.message, form.elements.message.value.trim(), '궁금한 점을 간단히 적어 주세요.');
    check(form.elements.agree, form.elements.agree.checked, '답변을 드리려면 동의가 필요합니다.');
    if (first) { first.focus(); return; }
    form.hidden = true;
    var done = document.getElementById('consult-done');
    done.hidden = false;
    done.focus();
  });
})();
