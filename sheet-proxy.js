(() => {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = function searchlightFetch(input, init) {
    try {
      const rawUrl = typeof input === 'string' ? input : input?.url;
      const url = new URL(rawUrl, window.location.href);

      if (
        url.hostname === 'docs.google.com' &&
        url.pathname.includes('/spreadsheets/d/e/') &&
        url.pathname.endsWith('/pub')
      ) {
        const gid = url.searchParams.get('gid');
        if (gid) {
          return nativeFetch(`/api/sheet?gid=${encodeURIComponent(gid)}&cache=${Date.now()}`, init);
        }
      }
    } catch (error) {
      console.warn('Searchlight sheet proxy fallback:', error);
    }

    return nativeFetch(input, init);
  };
})();
