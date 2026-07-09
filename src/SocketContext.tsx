import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface StudentState {
  name: string;
  isOnline: boolean;
  score: number;
  answers: Record<number, any>;
  hasAnsweredCurrent: boolean;
  isGuest?: boolean;
}

interface AppState {
  currentSlide: number;
  students: StudentState[];
}

interface RoomEventData {
  eventName: string;
  payload?: any;
}

interface SocketContextType {
  socket: Socket | null;
  state: AppState;
  role: 'teacher' | 'student' | null;
  joinSession: (role: 'teacher' | 'student', name?: string) => void;
  setSlide: (slideNumber: number) => void;
  submitAnswer: (answerData: any) => void;
  triggerEvent: (eventName: string, payload?: any) => void;
  roomEvent: RoomEventData | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [roomEvent, setRoomEvent] = useState<RoomEventData | null>(null);
  const [state, setState] = useState<AppState>({
    currentSlide: 1,
    students: []
  });

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('stateUpdate', (newState: AppState) => {
      setState(newState);
    });

    newSocket.on('roomEvent', (eventData: RoomEventData) => {
      setRoomEvent(eventData);
      // clear it shortly after so it can be re-triggered
      setTimeout(() => setRoomEvent(null), 500);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinSession = (selectedRole: 'teacher' | 'student', name?: string) => {
    setRole(selectedRole);
    if (socket) {
      socket.emit('join', { role: selectedRole, name });
    }
  };

  const setSlide = (slideNumber: number) => {
    if (socket && role === 'teacher') {
      socket.emit('setSlide', slideNumber);
    }
  };

  const submitAnswer = (answerData: any) => {
    if (socket && role === 'student') {
      socket.emit('submitAnswer', answerData);
    }
  };

  const triggerEvent = (eventName: string, payload?: any) => {
    if (socket && role === 'teacher') {
      socket.emit('triggerEvent', { eventName, payload });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, state, role, joinSession, setSlide, submitAnswer, triggerEvent, roomEvent }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
