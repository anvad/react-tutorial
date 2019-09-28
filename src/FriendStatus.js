import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    console.log(`in useEffect (FriendStatus)!`);
    function handleStatusChange(status) {
      console.log(`handleStatusChange. status=`, status);
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    // Specify how to clean up after this effect:
    return function cleanup() {
      console.log(`cleanup useEffect (FriendStatus): unsubscribeFromFriendStatus for ${props.friend.id}`);
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
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