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

    const onCreateRoom = async obj => {
        dispatch({type: 'SET-JOINED', payload: obj});
        socket.emit('ROOM:JOIN', obj);
        const data = await axios.get(`/rooms/${obj.roomId}`);
        debugger
        dispatch({type: 'SET-DATA', payload: data.data});
    };

    const onJoinRoom = async (obj) => {
        dispatch({type: 'SET-JOINED', payload: obj});
        socket.emit('ROOM:JOIN', obj);
        let data = await axios.get(`/rooms/${obj.roomId}`);
        debugger
        dispatch({type: 'SET-DATA', payload: data.data});
    }

    const setUsers = (users) => {
        dispatch({type: 'SET-USERS', users})
    };

    const setNewMessage = (message) => {
        dispatch({type: 'SET-NEW-MESSAGE', payload: message})
    };

    React.useEffect(() => {
        socket.on('SET-USERS', setUsers); // выполняется setUsers с юзерами с сервера
        socket.on('NEW-MESSAGE', setNewMessage);
    }, []);

    window.socket = socket;

    console.log('state = ', state);

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
