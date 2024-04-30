import {useCallback} from 'react';
import {Socket, io} from 'socket.io-client';
import Config from 'react-native-config';

// socket 변수를 함수에서 관리 하지 않는 이유는, socket 변수를 한번만 사용하기 위합입니다.
// 안티패턴이기는 합니다.
let socket: Socket | null;
export default function useSocket(): [Socket | null, () => void] {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }, []);

  if (!socket) {
    socket = io(`${Config.API_URL}`, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
}
