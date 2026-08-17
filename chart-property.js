(() => {
  state.chartProperty = 'all';
  const baseRenderChart = renderChart;

  function syncPropertyOptions() {
    const select = $('#chartPropertySelect');
    if (!select || !state.data) return;

    const properties = [...state.data.properties].sort((a, b) => a.name.localeCompare(b.name));
    const signature = properties.map(p => p.url).join('|');
    if (select.dataset.signature === signature) return;

    const current = state.chartProperty;
    select.replaceChildren(new Option(`All properties (${properties.length})`, 'all'));
    properties.forEach(property => select.add(new Option(property.name, property.url)));
    select.dataset.signature = signature;

    if (current !== 'all' && properties.some(property => property.url === current)) {
      select.value = current;
    } else {
      state.chartProperty = 'all';
      select.value = 'all';
    }
  }

  function selectedChartProperties() {
    if (!state.data || state.chartProperty === 'all') return state.data?.properties || [];
    const property = state.data.properties.find(item => item.url === state.chartProperty);
    if (property) return [property];
    state.chartProperty = 'all';
    return state.data.properties;
  }

  renderChart = function renderSelectedPropertyChart(_props, idx) {
    syncPropertyOptions();
    const props = selectedChartProperties();
    const subtitle = $('#chartSubtitle');
    if (subtitle) {
      subtitle.textContent = state.chartProperty === 'all'
        ? `All ${props.length} properties combined`
        : props[0]?.name || 'Selected property';
    }
    baseRenderChart(props, idx);
  };

  const select = $('#chartPropertySelect');
  if (select) {
    select.addEventListener('change', event => {
      state.chartProperty = event.target.value;
      render();
    });
  }
})();
