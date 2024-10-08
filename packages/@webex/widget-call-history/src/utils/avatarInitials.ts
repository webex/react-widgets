export function removeBracketsAndContent(str: string): string {
  if (str?.match(/^[+\d]/)) {
    return "#";
  }
  const words = str?.replace(/ *\([^)]*\) */g, ' ').replace(/ *\(\S*/g, '').replace(/\)+/g, '').replace(/\s+/g, ' ').trim().split(' ');
  const filteredWords = words?.filter(word => /^[a-zA-Z0-9]/.test(word));
  let initials = '';
  if (filteredWords?.length > 0) {
      initials += filteredWords[0][0].toUpperCase();
      if (filteredWords?.length > 1) {
          initials += filteredWords[filteredWords.length - 1][0].toUpperCase();
      }
  }
  if(initials?.length == 0 && str?.length > 0) {
    initials += str[0]; 
  }
  return initials;

  }

  export function titleCase(str: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(str);
    if (isEmail) {
      return str;
    } else {
      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }
      return splitStr.join(' ');
    }
 }