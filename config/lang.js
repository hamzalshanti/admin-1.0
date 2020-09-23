const supportedLanguages = ['en', 'ar'];
const defaultLanguage = 'en';

module.exports = (language) => {
  isExist = supportedLanguages.includes(language);
  if (isExist) {
    return require(`../languages/${language}.json`);
  } else {
    return require(`../languages/${defaultLanguage}.json`);
  }
};
