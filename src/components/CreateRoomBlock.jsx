import React from 'react';
import axios from 'axios'

function CreateRoomBlock({onCreateRoom}) {

    let [userName, setUserName] = React.useState('');

    let [isLoading, setLoading] = React.useState(false);

    let handleCreateRoom = async () => {
        if (!userName) {
            alert('ВВЕДИТЕ ИМЯ')
        } else {
            setLoading(true);
            let data = await axios.get('/create-room');
            let {roomId} = data.data;
            let obj = {roomId, userName};
            onCreateRoom(obj);
            setLoading(false);
            window.history.pushState(null, "", roomId.toString())
        }
    };

    const handleEnterButtonPress = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            handleCreateRoom();
        }
    };

    return (
        <div className="join-block">
            <span>Please, enter your name to create new room</span>

            <input onKeyPress={handleEnterButtonPress} type="text" placeholder="Ваше имя"
                   value={userName} onChange={(e) => {
                setUserName(e.target.value)
            }}/>
            <button disabled={isLoading} onClick={handleCreateRoom} className="btn btn-success">
                {isLoading ? '...ВХОД' : 'ВОЙТИ'}
            </button>
        </div>
    );
}

export default CreateRoomBlock;