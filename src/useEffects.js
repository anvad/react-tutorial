import React, { useState, useEffect } from 'react';
import FriendStatus from './FriendStatus';

const UseEffects = (props) => {
    console.log(`in UseEffects func component`);
    const [count, setCount] = useState(0);

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
            <p>Your friend {props.friend.id}'s status is: <FriendStatus friend={props.friend} /></p>
        </div>
    );
};

export default UseEffects;