import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, { setCredentials, logOut } from './authSlice';
import type { User } from './types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authSlice', () => {
  const initialState = { user: null, token: null };
  const testUser: User = { 
    id: 1, 
    email: 'test@test.com', 
    userName: 'tester',
    firstName: 'Test',
    lastName: 'User',
    role: {
      id: 1,
      name: 'user'
    }
  };
  const testToken = 'fake-jwt-token';

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should handle setCredentials', () => {
    const action = setCredentials({ user: testUser, accessToken: testToken });
    const newState = authReducer(initialState, action);
    
    expect(newState.user).toEqual(testUser);
    expect(newState.token).toBe(testToken);
  });

  it('should handle logOut', () => {
    const loggedInState = { user: testUser, token: testToken };
    const action = logOut();
    const newState = authReducer(loggedInState, action);
    
    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
  });

  it('should return initial state for unknown action', () => {
    const unknownAction = { type: 'unknown' };
    const newState = authReducer(initialState, unknownAction as any);
    
    expect(newState).toEqual(initialState);
  });

  it('should handle multiple setCredentials calls', () => {
    const firstUser = { ...testUser, id: 1, email: 'first@test.com' };
    const secondUser = { ...testUser, id: 2, email: 'second@test.com' };
    
    let state = authReducer(initialState, setCredentials({ user: firstUser, accessToken: 'token1' }));
    expect(state.user).toEqual(firstUser);
    expect(state.token).toBe('token1');
    
    state = authReducer(state, setCredentials({ user: secondUser, accessToken: 'token2' }));
    expect(state.user).toEqual(secondUser);
    expect(state.token).toBe('token2');
  });
}); 