const { translate } = require('free-translate');
const colors = require('colors');
const translateToTamil = async (s) => {
  console.log(s);
  //const translatedText = await translate(s, { from: 'en', to: 'ta' });
  //console.log(translatedText.green.bold);
  return s;
};
module.exports = translateToTamil;