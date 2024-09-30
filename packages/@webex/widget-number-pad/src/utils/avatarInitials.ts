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
