const dayjs = require('dayjs')
dayjs().format()

var now = dayjs()
console.log('now',now.get('hour'),now.get('minute'),now.get('second'),now.get('millisecond'))

// This example takes 2 seconds to run
//const start = Date.now();

// console.log('starting timer...');
// // Expected output: "starting timer..."

// setTimeout(() => {
//   const millis = Date.now() - start;

//   console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
//   // Expected output: "seconds elapsed = 2"
// }, 2000);

const date = new Date();

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

today.toDateString(); // "Sun Jun 14 2020"

today.toISOString(); // "2020-06-13T18:30:00.000Z"

console.log('time:',today.toISOString())
