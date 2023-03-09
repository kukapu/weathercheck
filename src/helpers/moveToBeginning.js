export function moveToBeginning( array, string ) {
  const index = array.indexOf(string);
  if (index !== -1) {
    array.splice(index, 1);
    array.unshift(string);
  }
  return array;
}