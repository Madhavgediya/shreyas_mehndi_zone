const slugifyLib = require('slugify');

const createSlug = (text) => {
  if (!text) return '';
  return slugifyLib(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    trim: true,
  });
};

module.exports = createSlug;
