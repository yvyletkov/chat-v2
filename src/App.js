import React from 'react';
import {Route} from 'react-router-dom';

import './App.css';
import socket from "./socket";
import reducer from './reducer'
import CreateRoomBlock from "./components/CreateRoomBlock";
import Chat from "./components/Chat";
import axios from "axios";
import JoinRoomBlock from "./components/JoinRoomBlock";

function App() {

    const [state, dispatch] = React.useReducer(reducer, {
        isJoined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: []
    });

    const onCreateRoom = async obj => {        // Подключаемся к комнате, получаем список пользователей
        socket.emit('JOIN-ROOM', obj);
        const data = await axios.get(`/rooms/${obj.roomId}`);
        dispatch({type: 'SET-DATA', payload: data.data});
    };

    const onJoinRoom = async (obj) => {        // Подключаемся к комнате, получаем сообщения и список пользователей
        dispatch({type: 'SET-JOINED', payload: obj});
        socket.emit('JOIN-ROOM', obj);
        let data = await axios.get(`/rooms/${obj.roomId}`);
        dispatch({type: 'SET-DATA', payload: data.data});
    }

    const setUsers = (users) => {
        dispatch({type: 'SET-USERS', users})
    };

    const setNewMessage = (message) => {
        dispatch({type: 'SET-NEW-MESSAGE', payload: message})
    };

    React.useEffect(() => {
        socket.on('SET-USERS', setUsers);
        socket.on('NEW-MESSAGE', setNewMessage);
    }, []);

    // Если в ссылке указана комната, то у пользователя будет возможность подключиться к ней (если она существует)
    // Если в ссылке комнаат не указана, то будет предложено создать новую (с рандомным ID)

    if (state.isJoined) return <div className="wrapper"><Chat {...state} onAddNewMessage={setNewMessage}/></div>

    else return (
            <div className="wrapper">
                <Route exact path='/:roomId'
                       render={(props) => <JoinRoomBlock {...props} onJoinRoom={onJoinRoom}/> }/>
                <Route exact path='/'
                       render={() => <CreateRoomBlock onCreateRoom={onCreateRoom}/> }/>
            </div>
    );
}

export default App;
