import React, { useState, useEffect } from 'react';

const TYPING_SPEED = 20;
const SHOW_TIME = 10000;
const DEL_SPEED = 15;

const Typewriter = ({ text, speed, callback }) => {
    const [display, setDisplay] = useState(" ");

  const [typing, setTyping] = useState(true);
  // type the characters one by one
  useEffect(() => {
    if (!text || !text.trim().length) return;
    let typingTimer;
    if (typing) {
      let idx = 0;
      typingTimer = setInterval(() => {
        if (idx <= text.length) {
          setDisplay(text.substring(0, idx));
          idx++;
        } else {
          // when all characters are typed, after SHOW_TIME set clear flag
          clearInterval(typingTimer);
          setTimeout(() => {
            setTyping(false);
            setClearing(true);
            callback();
          }, SHOW_TIME);
        }
      }, TYPING_SPEED);
    }

    return () => {
      clearInterval(typingTimer);
    };
  }, [text, typing]);

  // clear the characters one by one
  const [clearing, setClearing] = useState(false);
//   useEffect(() => {
//     let clearTimer;
//     if (clearing) {
//       let idx = text.length - 1;
//       clearTimer = setInterval(() => {
//         if (idx >= 0) {
//           setDisplay(text.substring(0, idx));
//           idx--;
//         } else {
//           // when all characters cleared, reset and invoke the callback
//           clearInterval(clearTimer);
//           setClearing(false);
//           setTyping(true);
//         }
//       }, DEL_SPEED);
//     }
//     return () => {
//       if (clearTimer) {
//         clearInterval(clearTimer);
//       }
//     };
//   }, [clearing, text]);
  return <p>{display || text[0]}</p>;
//   const [displayedText, setDisplayedText] = useState('');
//   const [typing, setTyping] = useState(true);

  
//   useEffect(() => {
//     //   console.log(text[0])
//       if (!text || !text.trim().length) return;
//       let typingTimer;
//       if (typing) {
//     let index = 0;
//     typingTimer = setInterval(() => {
//         // console.log("hello", text[index]);
//         if(index <= text.length)
//       setDisplayedText(text.substring(0, index));
//       index ++;
      
//       if (index === text.length-1) {
//         clearInterval(intervalId);
//       }
//     }, speed);
// }

//     return () => clearInterval(intervalId);
//   }, [text, speed]);

// //   console.log("displayedText", displayedText)

//   return <p>{displayedText}</p>;
};

export default Typewriter;