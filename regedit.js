console.log('REGEDIT.js')
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions

const re = new RegExp("ab+c");

const text = 'A quick fox';

const regexpLastWord = /\w+$/;
console.log(text.match(regexpLastWord));
// Expected output: Array ["fox"]

const regexpWords = /\b\w+\b/g;
console.log(text.match(regexpWords));
// Expected output: Array ["A", "quick", "fox"]

const regexpFoxQuality = /\w+(?= fox)/;
console.log(text.match(regexpFoxQuality));
// Expected output: Array ["quick"]

const chessStory = 'He played the King in a8 and she moved her Queen in c2.';
const regexpCoordinates = /\w\d/g;
const short = /\w[0-9]/g;
console.log(chessStory.match(short));
console.log(chessStory.match(regexpCoordinates));
// Expected output: Array [ 'a8', 'c2']

const moods = 'happy 🙂, confused 😕, sad 😢';
const regexpEmoticons = /[\u{1F600}-\u{1F64F}]/gu;
console.log(moods.match(regexpEmoticons));
// Expected output: Array ['🙂', '😕', '😢']

const withquote='a""a"'
const finddoublequote = /\"/g
console.log(withquote.match(finddoublequote))
console.log(withquote.replaceAll(finddoublequote,"'"))

//const event = new Date('05 October 2011 14:48 UTC');
// const event = Date.now()
// console.log(event.toString());
// console.log(event.toISOString());
// Expected output: "2011-10-05T14:48:00.000Z"

//console.log('date:',Date.now().toString)

// This example takes 2 seconds to run
const start = Date.now();

console.log('starting timer...');
// Expected output: "starting timer..."

setTimeout(() => {
  const millis = Date.now() - start;

  console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
  // Expected output: "seconds elapsed = 2"
}, 2000);
