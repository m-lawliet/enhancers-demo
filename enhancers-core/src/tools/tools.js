function localeToLang(locale = '') {
  return locale.split('_')[0];
}

module.exports = { localeToLang };
