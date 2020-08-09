import React from "react";
import socket from "../socket";

const Chat = ({users, messages, userName, roomId, onAddNewMessage}) => {

    let [messageText, setMessageText] = React.useState('');

    const messagesRef = React.useRef();

    React.useEffect( () => {
        messagesRef.current.scrollTo(0, 99999);
    }, [messages]);

    let onMessageInputChange = (e) => {
        setMessageText(e.target.value)
    };

    let handleSubmit = () => {

        const currentDate = new Date();
        const hours = currentDate.getHours().toString().length === 1
            ? '0' + currentDate.getHours()
            : currentDate.getHours();
        const minutes = currentDate.getMinutes().toString().length === 1
            ? '0' + currentDate.getMinutes()
            : currentDate.getMinutes();

        const time = `${hours}:${minutes}`;

        socket.emit('NEW-MESSAGE', {
            roomId,
            userName,
            text: messageText
        });
        onAddNewMessage( {userName, text: messageText, time} );
        setMessageText('');
    };

    const handleEnterButtonPress = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className='chat'>
            <div className='chat-users'>
                <h5>RoomID: {roomId}</h5>
                <h5>Your name: {userName}</h5>
                <hr/>
                <h6>Users ({users ? users.length:'0'}):</h6>
                <ul>
                    {users ? users.map( (name, index) => <li key={name + index}>{name}</li>) :
                    null }
                </ul>
            </div>
            <div className='chat-messages'>

                <div ref={messagesRef} className='messages'>
                    { messages ? messages.map( (message, index) => {
                        return <div key={index} className='message'>
                            <div className='message-body bg-primary'>{message ? message.text : null}</div>
                            <div>
                                <span>{message ? message.time + ' /': null}</span>
                                <span>{message ? ' ' + message.userName : null}</span>
                            </div>
                        </div>
                    }) : null}
                </div>

                <form>
                    <textarea onKeyPress={handleEnterButtonPress} value={messageText} onChange={onMessageInputChange}/>
                </form>
                    <button onClick={handleSubmit} className='btn btn-primary'>Send</button>
            </div>
        </div>
    )
};

export default Chat;