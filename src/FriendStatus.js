import { useState, useEffect } from 'react';

function FriendStatus(props) {
  console.log(`in FriendStatus. props=`, props.friend.id);
  // const [isOnline, setIsOnline] = useState(null);
  const [status, setStatus] = useState({ isOnline: null });

  useEffect(() => {
    console.log(`in useEffect (FriendStatus)!`);
    function handleStatusChange(status) {
      console.log(`handleStatusChange. status=`, status);
      setStatus(status);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    // Specify how to clean up after this effect:
    return function cleanup() {
      console.log(`cleanup useEffect (FriendStatus): unsubscribeFromFriendStatus for ${props.friend.id}`);
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };

  }, [props.friend.id]);
  // here we solved the infinite loop problem by passing a dependency array

  if (status.isOnline === null) {
    return 'Loading...';
  }
  return status.isOnline ? 'Online' : 'Offline';
}

export class ChatAPI {
  static friends = {}
  static friendStatus = {}
  static subscribeToFriendStatus = (friendId, handleStatusChange) => {
    console.log('subscribeToFriendStatus friendId=', friendId);
    const eventListeners = ChatAPI.friends[friendId] || new Set();
    eventListeners.add(handleStatusChange);
    ChatAPI.friends[friendId] = eventListeners;

    const status = ChatAPI.friendStatus || {};
    ChatAPI.friendStatus = status;
    // if (!status[friendId]) {
    //   setTimeout(() => {
    //     status[friendId] = { isOnline: (Math.random() < 0.5) };
    //     ChatAPI.callEventHandlers(friendId);
    //   }, 1000);
    // }
    setTimeout(() => {
      status[friendId] = { isOnline: (Math.random() < 0.5) };
      ChatAPI.callEventHandlers(friendId);
    }, 1000);
  }
  static unsubscribeFromFriendStatus = (friendId, handleStatusChange) => {
    console.log(`unsubscribing eventHandler for ${friendId}`);
    const eventListeners = ChatAPI.friends[friendId];
    if (eventListeners) {
      eventListeners.delete(handleStatusChange);
    }
  }
  static mockSetFriendOnline = (friendId) => {
    const eventListeners = ChatAPI.friends[friendId];
    if (eventListeners) {
      for (const eventListener of eventListeners.keys()) {
        eventListener({ isOnline: true });
      }
    }
  }
  static mockToggleFriendStatus = (friendId) => {
    const status = ChatAPI.friendStatus;
    // console.log('status before=', status, friendId, status[friendId]);
    status[friendId] = { isOnline: !(status[friendId].isOnline), abc: true };
    // console.log('status after=', status[friendId]);
    ChatAPI.callEventHandlers(friendId);
  }
  static callEventHandlers = (friendId) => {
    const eventListeners = ChatAPI.friends[friendId];
    if (eventListeners) {
      for (const eventListener of eventListeners.keys()) {
        eventListener(ChatAPI.friendStatus[friendId]);
      }
    }
  }
}

export default FriendStatus;