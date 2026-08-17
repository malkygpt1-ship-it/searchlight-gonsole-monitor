(() => {
  const columns = [
    { index: 0, sort: 'name', label: 'Property' },
    { index: 1, sort: 'impressions', label: 'Impressions' },
    { index: 2, sort: 'clicks', label: 'Clicks' },
    { index: 3, sort: 'ctr', label: 'CTR' },
    { index: 4, sort: 'position', label: 'Avg. position' },
    { index: 5, sort: 'movement', label: '30-day trend' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .properties-card th.sortable-header{cursor:pointer;user-select:none;transition:background .15s,color .15s}
    .properties-card th.sortable-header:hover{background:#f1f5f1;color:#51625a}
    .properties-card th.sortable-header:focus-visible{outline:2px solid #8fbf55;outline-offset:-2px}
    .properties-card th.sortable-header .sort-button{pointer-events:none;margin-left:3px;font-size:10px;min-width:13px}
    .properties-card th.sortable-header.is-sorted{color:#315746;background:#f4f8f4}
  `;
  document.head.appendChild(style);

  const headers = [...document.querySelectorAll('.properties-card thead th')];

  function applySort(sort) {
    if (state.sort === sort) {
      state.direction *= -1;
    } else {
      state.sort = sort;
      state.direction = sort === 'name' ? 1 : -1;
    }
    render();
  }

  function updateIndicators() {
    columns.forEach(({ index, sort, label }) => {
      const th = headers[index];
      if (!th) return;
      const button = th.querySelector('.sort-button');
      const active = state.sort === sort;
      th.classList.toggle('is-sorted', active);
      th.setAttribute('aria-sort', active ? (state.direction === 1 ? 'ascending' : 'descending') : 'none');
      th.title = `Sort ${label} ${active && state.direction === 1 ? 'descending' : 'ascending'}`;
      if (button) button.textContent = active ? (state.direction === 1 ? '▲' : '▼') : '↕';
    });
  }

  columns.forEach(({ index, sort, label }) => {
    const th = headers[index];
    if (!th) return;

    let button = th.querySelector('.sort-button');
    if (!button) {
      button = document.createElement('button');
      button.className = 'sort-button';
      button.type = 'button';
      button.dataset.sort = sort;
      button.setAttribute('aria-label', `Sort by ${label}`);
      th.append(' ', button);
    }

    // app.js already handles clicks on its original sort buttons. Prevent those
    // clicks bubbling into the header and causing a second sort reversal.
    button.addEventListener('click', event => event.stopPropagation());

    th.classList.add('sortable-header');
    th.tabIndex = 0;
    th.addEventListener('click', () => applySort(sort));
    th.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        applySort(sort);
      }
    });
  });

  const baseRender = render;
  render = function renderWithSortIndicators() {
    baseRender();
    updateIndicators();
  };

  updateIndicators();
})();
