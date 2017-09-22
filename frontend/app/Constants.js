export const REST_SERVER_BASE_URL = 'http://localhost:8080/api';

export const LOGIN_URL = `${REST_SERVER_BASE_URL}/login`;
export const REGISTER_USER_URL = `${REST_SERVER_BASE_URL}/registeruser`;

export const GET_USERS_URL = `${REST_SERVER_BASE_URL}/user`;
export const DELETE_USER_URL = `${GET_USERS_URL}`;
export const UPDATE_USER_URL = `${GET_USERS_URL}`;
export const CREATE_USER_URL = `${GET_USERS_URL}`;

export const GET_MANAGERS_URL = `${REST_SERVER_BASE_URL}/manager`;
export const DELETE_MANAGER_URL = `${GET_MANAGERS_URL}`;
export const UPDATE_MANAGER_URL = `${GET_MANAGERS_URL}`;
export const CREATE_MANAGER_URL = `${GET_MANAGERS_URL}`;

export const PING_URL = `${REST_SERVER_BASE_URL}/ping`;
