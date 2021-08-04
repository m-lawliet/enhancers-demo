function localeToLang(locale = '') {
  return locale.split('_')[0];
}

function startTimer({ units = true } = {}) {
  const startTime = Date.now();
  return () => {
    const elapsedTime = Math.ceil(Date.now() - startTime);
    return units ? `${elapsedTime}ms` : elapsedTime;
  };
}

module.exports = { localeToLang, startTimer };
