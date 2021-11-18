import pinyin from 'pinyin';

/**
 * 获取文本拼音的第一个字母并大写
 * @param word
 */
export const getFirstCapitalizedLetter = (word) => {
  if (word) {
    return pinyin(word, { style: pinyin.STYLE_NORMAL, heteronym: false })?.[0][0].slice(0, 1).toLocaleUpperCase();
  }
  return null;
};
