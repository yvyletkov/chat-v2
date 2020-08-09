import React from 'react';
import axios from 'axios'

function JoinRoomBlock(props) {
    console.log('PROPS:', props);

    let roomId = +props.match.params.roomId;

    let [userName, setUserName] = React.useState('');
    let [isLoading, setLoading] = React.useState(false);
    let [error, setError] = React.useState(false);

    let handleJoinRoom = async () => {      // Реквестим, существует ли комната. Если да, входим в нее

        if (!userName) {
            alert('ВВЕДИТЕ ИМЯ')
        } else {
            setLoading(true);
            let {data} = await axios.get(`/check-room/${roomId}`);
            debugger
            if (data.roomExist) {
                let obj = {roomId, userName};
                props.onJoinRoom(obj);
                setLoading(false);
            }
            else {
                setError(true)
            }
        }
    };

    const handleEnterButtonPress = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            handleJoinRoom();
        }
    };

    return (<React.Fragment>

            <div className="join-block">
                <span>You are invited to the room {roomId}</span>

                <input onKeyPress={handleEnterButtonPress} type="text" placeholder="Ваше имя"
                       value={userName} onChange={(e) => {
                    setUserName(e.target.value)
                }}/>
                <button onClick={handleJoinRoom} className="btn btn-success">
                    {isLoading ? '...ВХОД' : 'ВОЙТИ'}
                </button>
                {error && <span>Room does not exist</span>}
            </div>
        </React.Fragment>
    );
}

export default JoinRoomBlock;