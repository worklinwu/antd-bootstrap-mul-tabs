function getLocale(): string {
  if (typeof window !== 'undefined') {
    if (!window.localStorage.getItem('lang')) {
      window.localStorage.setItem('lang', navigator.language);
    }

    return localStorage.getItem('lang') || '';
  }

  return '';
}

function setLocale(lang: string) {
  if (lang !== undefined && !/^([a-z]{2})-([A-Z]{2})$/.test(lang)) {
    throw new Error('setLocale lang format error.');
  }

  if (typeof window !== 'undefined' && getLocale() !== lang) {
    window.localStorage.setItem('lang', lang);
    window.location.reload();
  }
}

export { setLocale, getLocale };
