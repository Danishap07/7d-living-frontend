import { useState, useEffect, useRef } from "react";
// import logo from './logo.svg';
import { FaArrowCircleUp } from "react-icons/fa";
import './App.css';
import Typewriter from "./components/typeWriterEffect";
import SpeechToText from "./components/speech-to-text";

function App() {

  const listRef = useRef(null);
  const [question, set_question] = useState("");
  const [message, set_message] = useState(null);
  const [previous_chats, set_previous_chats] = useState([]);
  const [current_title, set_current_title] = useState(null);
  const [new_propt, set_new_prompt] = useState(false);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView()
  }, [previous_chats])

  useEffect(() => {
    if (!current_title && question && message) {
      set_current_title(question)
    }

    if (current_title && question && message) {
      set_new_prompt(true)
      set_previous_chats(prevChats => (
        [...prevChats,
        {
          title: current_title,
          user: {
            content: question
          },
          assistant: {
            content: message.content
          }
        }
        ]
      ))
      set_question("");
      
    }
  }, [message, current_title])

  const createNewChat = () => {
    set_message(null);
    set_question(null);
    set_current_title(null);
  }

  const handleSubmit = async () => {
    var formIsValid = true;
    if (question === "") {
      return formIsValid = false
    }
    try {
      const options = {
        "method": "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "question": question
        })
      }
      // const data= JSON.stringify({
      //   "question": question
      // })
      const res = await fetch("https://sevend-assignment-backend.onrender.com/api/completion", options);
      const data = await res.json();
      // if(data.status) {
      console.log("first", data)
      set_message(data.message.choices[0].message)
      // }
    } catch (error) {
      console.error(error)
    }
  }

  const currentChats = previous_chats.filter(previous_chats => previous_chats.title === current_title);
  const uniqueTitle = Array.from(new Set(previous_chats.map(previous_chats => previous_chats.title)))
  console.log(currentChats)


  return (
    <div className="App">
      {/* Hello World */}
      <section className='side-bar'>
        <button className='btn' onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          {
            uniqueTitle.map((e, i) => <li key={i} onClick={() => set_current_title(e)} className=''>{e}</li>)
          }
        </ul>
        <nav>
          <p>Created By Danish</p>
        </nav>
      </section>
      <section className='main'>
        <div className='botton-section'>
          <div className='input-container'>
          <SpeechToText callback={(data) => set_question(data)} />
            <input type="text" value={question} placeholder="Message ChatGPT" onChange={(e) => set_question(e.target.value)} />
            <div id="submit" style={!question ? { opacity: 0.5 } : { opacity: 1 }} onClick={handleSubmit}>
              <FaArrowCircleUp type="submit" className="submit-icon" />
            </div>
              
          </div>
          <div className='info'>ChatGPT can make mistakes. Check important info.</div>
        </div>
        <ul className="feed" ref={listRef}>
          {currentChats.map((e, i) => <li key={i}>
            <div className="user" style={{ display: "flex" }}> <p>User: </p> <p > &nbsp;{e.user.content}</p></div>
            <div className="assistant" style={{ display: "flex" }}> <p>Assistant:&nbsp;</p>{i !== currentChats.length-1 ? <p>{e.assistant.content}</p>:<Typewriter text={e.assistant.content} speed={30} callback={() => set_new_prompt(false)} />}</div>
          </li>)}
        </ul>
        <h1 className='heading'>ChatGPT for 7D Living</h1>

      </section>
    </div>
  );
}

export default App;

// fa FaArrowCircleUp