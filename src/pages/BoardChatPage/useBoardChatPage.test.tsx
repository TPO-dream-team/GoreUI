import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { useBoardChatPage } from './useBoardChatPage';
import api from '@/utility/axios';
import goreReducer, { fetchGore } from '@/utility/stores_slices/goreSlice';

vi.mock('@/utility/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockUseParams = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation(),
  };
});

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      mountain: goreReducer,
    },
    preloadedState: initialState,
  });
};

describe('useBoardChatPage', () => {
  const mockBoardDetails = {
    id: '123',
    expiryDate: '2024-12-31',
    userId: 'user1',
    mountainId: '456',
    description: 'Test board description',
    tourTime: 120,
    difficulty: 3,
  };

  const mockMessages = [
    {
      id: 1,
      boardId: '123',
      userId: 'user1',
      username: 'JohnDoe',
      msg: 'First comment',
      timestamp: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      boardId: '123',
      userId: 'user2',
      username: 'JaneDoe',
      msg: 'Second comment',
      timestamp: '2024-01-01T11:00:00Z',
    },
  ];

  const mockMountainData = [
    { id: '456', name: 'Mountain Peak', height: 2500, regionId: 1, lat: 45.0, lon: 10.0 },
    { id: '789', name: 'Another Mountain', height: 3000, regionId: 2, lat: 46.0, lon: 11.0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseLocation.mockReturnValue({ state: { organizer: 'Test Organizer' } });
    
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123') {
        return Promise.resolve({ data: mockBoardDetails });
      }
      if (url === '/boards/123/chats') {
        return Promise.resolve({ data: mockMessages });
      }
      if (url === '/mountain') {
        return Promise.resolve({ data: mockMountainData });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    (api.post as any).mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const wrapper = (store: any) => ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  it('should initialize with default state values', () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: null }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    expect(result.current.state.board).toBeNull();
    expect(result.current.state.messages).toEqual([]);
    expect(result.current.state.message).toBe('');
    expect(result.current.state.loadingBoard).toBe(true);
    expect(result.current.state.loadingMessages).toBe(true);
    expect(result.current.state.sending).toBe(false);
    expect(result.current.state.boardError).toBe('');
    expect(result.current.state.commentError).toBe('');
  });

  it('should load board, messages, and mountains on mount', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: null }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
      expect(result.current.state.loadingMessages).toBe(false);
    });
    
    expect(result.current.state.board).toEqual(mockBoardDetails);
    expect(result.current.state.messages).toEqual(mockMessages);
    expect(api.get).toHaveBeenCalledWith('/boards/123');
    expect(api.get).toHaveBeenCalledWith('/boards/123/chats');
    expect(api.get).toHaveBeenCalledWith('/mountain');
  });

  it('should use existing mountain data from Redux store if available', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
      expect(result.current.state.loadingMessages).toBe(false);
    });
    
    expect(result.current.state.mountain).toEqual(mockMountainData[0]);
    expect(api.get).not.toHaveBeenCalledWith('/mountain');
  });

  it('should handle API error when loading board fails', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123') {
        return Promise.reject({
          response: { data: { message: 'Board not found' } }
        });
      }
      return Promise.resolve({ data: [] });
    });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.boardError).toBe('Board not found');
      expect(result.current.state.loadingBoard).toBe(false);
    });
  });

  it('should handle API error when loading messages fails', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123/chats') {
        return Promise.reject({
          response: { data: { message: 'Failed to load comments' } }
        });
      }
      return Promise.resolve({ data: mockBoardDetails });
    });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.commentError).toBe('Failed to load comments');
      expect(result.current.state.loadingMessages).toBe(false);
    });
  });

  it('should handle generic error when no response message is provided', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123') {
        return Promise.reject({ response: { data: null } });
      }
      return Promise.resolve({ data: [] });
    });

    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });

    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(result.current.state.boardError).toBe('Error while loading board.');
    });
  });

  it('should find the correct mountain based on board mountainId', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.mountain).toEqual(mockMountainData[0]);
    });
  });

  it('should return undefined mountain when no match found', async () => {
    const differentBoard = { ...mockBoardDetails, mountainId: '999' };
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123') {
        return Promise.resolve({ data: differentBoard });
      }
      if (url === '/boards/123/chats') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/mountain') {
        return Promise.resolve({ data: mockMountainData });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: null }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.board).toEqual(differentBoard);
    });
    
    expect(result.current.state.mountain).toBeUndefined();
  });

  it('should get organizer from location state', () => {
    mockUseLocation.mockReturnValue({ state: { organizer: 'Custom Organizer' } });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    expect(result.current.state.organizerFromState).toBe('Custom Organizer');
  });

  it('should handle missing organizer in location state', () => {
    mockUseLocation.mockReturnValue({ state: null });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    expect(result.current.state.organizerFromState).toBeUndefined();
  });

  it('should update message state when setMessage is called', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    act(() => {
      result.current.actions.setMessage('New message');
    });
    
    expect(result.current.state.message).toBe('New message');
  });

  it('should successfully send a message', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    // Clear previous API calls
    vi.clearAllMocks();
    
    act(() => {
      result.current.actions.setMessage('Test message');
    });
    
    act(() => {
      result.current.actions.handleSendMessage();
    });
    
    expect(result.current.state.sending).toBe(true);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/boards/123/chats', {
        Message: 'Test message',
      });
      expect(result.current.state.message).toBe('');
      expect(result.current.state.sending).toBe(false);
      expect(api.get).toHaveBeenCalledWith('/boards/123/chats');
    });
  });

  it('should not send empty messages', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    act(() => {
      result.current.actions.setMessage('   ');
    });
    
    act(() => {
      result.current.actions.handleSendMessage();
    });
    
    expect(result.current.state.commentError).toBe('Write the comment first.');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should handle error when sending message fails', async () => {
    const errorMessage = 'Failed to send message';
    (api.post as any).mockRejectedValue({
      response: { data: { message: errorMessage } }
    });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    act(() => {
      result.current.actions.setMessage('Test message');
    });
    
    act(() => {
      result.current.actions.handleSendMessage();
    });
    
    await waitFor(() => {
      expect(result.current.state.commentError).toBe(errorMessage);
      expect(result.current.state.sending).toBe(false);
    });
  });

  it('should handle network error when sending message', async () => {
    (api.post as any).mockRejectedValue(new Error('Network error'));
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    act(() => {
      result.current.actions.setMessage('Test message');
    });
    
    act(() => {
      result.current.actions.handleSendMessage();
    });
    
    await waitFor(() => {
      expect(result.current.state.commentError).toBe('Error while sending message.');
      expect(result.current.state.sending).toBe(false);
    });
  });

  it('should not attempt to load data if id is not provided', async () => {
    mockUseParams.mockReturnValue({ id: undefined });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(api.get).not.toHaveBeenCalledWith('/boards/undefined');
    expect(api.get).not.toHaveBeenCalledWith('/boards/undefined/chats');
    expect(result.current.state.loadingBoard).toBe(true);
    expect(result.current.state.loadingMessages).toBe(true);
  });

  it('should not send message if id is not provided', async () => {
    mockUseParams.mockReturnValue({ id: undefined });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    act(() => {
      result.current.actions.setMessage('Test message');
    });
    
    act(() => {
      result.current.actions.handleSendMessage();
    });
    
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should reload messages after successful send', async () => {
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: mockMountainData }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    // Clear the initial API calls
    vi.clearAllMocks();
    
    act(() => {
      result.current.actions.setMessage('Test message');
    });
    
    act(() => {
      result.current.actions.handleSendMessage();
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledWith('/boards/123/chats');
      // Should have called loadMessages which fetches chats
      expect(api.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle case when messages response is null', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123') {
        return Promise.resolve({ data: mockBoardDetails });
      }
      if (url === '/boards/123/chats') {
        return Promise.resolve({ data: null });
      }
      if (url === '/mountain') {
        return Promise.resolve({ data: mockMountainData });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: null }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.loadingMessages).toBe(false);
      expect(result.current.state.messages).toEqual([]);
    });
  });

  it('should handle when board data is loaded but mountain fetch is pending', async () => {
    let mountainFetchResolve: any;
    const mountainPromise = new Promise((resolve) => {
      mountainFetchResolve = resolve;
    });
    
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/boards/123') {
        return Promise.resolve({ data: mockBoardDetails });
      }
      if (url === '/boards/123/chats') {
        return Promise.resolve({ data: mockMessages });
      }
      if (url === '/mountain') {
        return mountainPromise;
      }
      return Promise.reject(new Error('Not found'));
    });
    
    const store = createTestStore({
      mountain: { loading: false, error: null, gore: null }
    });
    const { result } = renderHook(() => useBoardChatPage(), { wrapper: wrapper(store) });
    
    await waitFor(() => {
      expect(result.current.state.board).toBeDefined();
      expect(result.current.state.loadingBoard).toBe(false);
    });
    
    expect(result.current.state.mountain).toBeUndefined();
    
    // Resolve mountain fetch
    act(() => {
      mountainFetchResolve({ data: mockMountainData });
    });
    
    await waitFor(() => {
      expect(result.current.state.mountain).toEqual(mockMountainData[0]);
    });
  });
});