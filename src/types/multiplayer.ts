// Player types
export interface Player {
  id: string;
  name: string;
  ready: boolean;
  connected: boolean;
}

// Room types
export interface RoomState {
  code: string;
  name: string;
  hostId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
}

export interface PublicRoomInfo {
  code: string;
  name: string;
  hostName: string;
  playerCount: number;
}

// Client -> Server messages
export interface CreateRoomMessage {
  type: 'create_room';
  playerName: string;
  roomName?: string;
  isPublic?: boolean;
}

export interface JoinRoomMessage {
  type: 'join_room';
  roomCode: string;
  playerName: string;
}

export interface LeaveRoomMessage {
  type: 'leave_room';
}

export interface SetReadyMessage {
  type: 'set_ready';
  ready: boolean;
}

export interface StartGameMessage {
  type: 'start_game';
}

export interface GetRoomsMessage {
  type: 'get_rooms';
}

export interface RelayMessage {
  type: 'relay';
  payload: any;
}

export interface PongMessage {
  type: 'pong';
}

export interface ReconnectMessage {
  type: 'reconnect';
  roomCode: string;
  reconnectToken: string;
}

export interface SyncRequestMessage {
  type: 'sync_request';
  lastReceivedTimestamp: number;
}

export type ClientMessage =
  | CreateRoomMessage
  | JoinRoomMessage
  | LeaveRoomMessage
  | SetReadyMessage
  | StartGameMessage
  | GetRoomsMessage
  | RelayMessage
  | PongMessage
  | ReconnectMessage
  | SyncRequestMessage;

// Server -> Client messages
export interface ConnectedMessage {
  type: 'connected';
  playerId: string;
  serverTime?: number;
}

export interface RoomCreatedMessage {
  type: 'room_created';
  roomCode: string;
  playerId: string;
  reconnectToken?: string;
}

export interface JoinedRoomMessage {
  type: 'joined_room';
  roomCode: string;
  playerId: string;
  roomState: RoomState;
  reconnectToken?: string;
}

export interface RoomStateMessage {
  type: 'room_state';
  roomState: RoomState;
}

export interface RoomListMessage {
  type: 'room_list';
  rooms: PublicRoomInfo[];
}

export interface PlayerJoinedMessage {
  type: 'player_joined';
  player: Player;
}

export interface PlayerLeftMessage {
  type: 'player_left';
  playerId: string;
  reason?: string;
}

export interface PlayerReadyMessage {
  type: 'player_ready';
  playerId: string;
  ready: boolean;
}

export interface GameStartedMessage {
  type: 'game_started';
  gameSeed?: number;
  timestamp?: number;
}

export interface RelayedMessage {
  type: 'relayed';
  fromPlayerId: string;
  payload: any;
  timestamp?: number;
}

export interface PingMessage {
  type: 'ping';
  timestamp: number;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
  code?: string;
}

export type ServerMessage =
  | ConnectedMessage
  | RoomCreatedMessage
  | JoinedRoomMessage
  | RoomStateMessage
  | RoomListMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | PlayerReadyMessage
  | GameStartedMessage
  | RelayedMessage
  | PingMessage
  | ErrorMessage;
