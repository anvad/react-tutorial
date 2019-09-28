import React, { useState, useEffect } from 'react';
import FriendStatus from './FriendStatus';

const UseEffects = (props) => {
    const [count, setCount] = useState(0);
    const [friendId, setFriendId] = useState('SK');

    useEffect(() => {
        console.log('in useEffect (count)', count);
        document.title = "You clicked " + count + " times.";
    }, [count]);
    // putting [count] above tells React to skip calling this function
    //  after this render unless count changed
    return (
        <div>
            <p>You clicked {count} times.</p>
            <button onClick={() => setCount(count + 1)}>{props.buttonName || 'Click me'}</button>
            <p>Your friend {friendId}'s status is: <FriendStatus friend={{ id: "SK" }} /></p>
        </div>
    );
};

export default UseEffects;