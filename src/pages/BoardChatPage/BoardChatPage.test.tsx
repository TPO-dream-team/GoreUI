import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BoardChatPage from './BoardChatPage';
import * as useBoardChatPageModule from './useBoardChatPage';

vi.mock('./useBoardChatPage', () => ({
  useBoardChatPage: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyDown, placeholder }: any) => (
    <input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  ),
}));

vi.mock('@/components/common/BoardCard', () => ({
  default: ({ mountainName, mountainHeight, date, duration, organizer, description, difficulty }: any) => (
    <div data-testid="board-card">
      <div>Mountain: {mountainName}</div>
      <div>Height: {mountainHeight}</div>
      <div>Date: {date}</div>
      <div>Duration: {duration}</div>
      <div>Organizer: {organizer}</div>
      <div>Description: {description}</div>
      <div>Difficulty: {difficulty}</div>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useOutletContext: () => ({ useNewStyle: true }),
  };
});

describe('BoardChatPage', () => {
  const mockState = {
    board: {
      id: '1',
      expiryDate: '2024-12-31',
      userId: 'user1',
      mountainId: 'mountain1',
      description: 'Test board description',
      tourTime: 120,
      difficulty: 3,
    },
    messages: [
      {
        id: 1,
        boardId: '1',
        userId: 'user1',
        username: 'JohnDoe',
        msg: 'Test comment 1',
        timestamp: '2024-01-01T10:00:00Z',
      },
    ],
    message: '',
    loadingBoard: false,
    loadingMessages: false,
    sending: false,
    boardError: '',
    commentError: '',
    mountain: {
      id: 'mountain1',
      name: 'Everest',
      height: 8848,
    },
    organizerFromState: 'Test Organizer',
  };

  const mockActions = {
    setMessage: vi.fn(),
    handleSendMessage: vi.fn(),
    loadMessages: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: mockState,
      actions: mockActions,
    });
  });

  const renderComponent = () => {
    const store = configureStore({ reducer: {} });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <BoardChatPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should call navigate when back button is clicked', () => {
    renderComponent();
    const backButton = screen.getByText(/back to/i);
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/board');
  });

  it('should display board error message when present', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, boardError: 'Failed to load board' },
      actions: mockActions,
    });
    renderComponent();
    expect(screen.getByText('Failed to load board')).toBeInTheDocument();
  });

  it('should render BoardCard when board exists', () => {
    renderComponent();
    expect(screen.getByTestId('board-card')).toBeInTheDocument();
    expect(screen.getByText(/Mountain: Everest/)).toBeInTheDocument();
    expect(screen.getByText(/Organizer: Test Organizer/)).toBeInTheDocument();
  });

  it('should show loading message when loading messages', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, loadingMessages: true },
      actions: mockActions,
    });
    renderComponent();
    expect(screen.getByText(/loading comments/i)).toBeInTheDocument();
  });

  it('should show "No comments yet" when messages array is empty', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, messages: [] },
      actions: mockActions,
    });
    renderComponent();
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });

  it('should render all messages', () => {
    renderComponent();
    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
    expect(screen.getByText('Test comment 1')).toBeInTheDocument();
  });

  it('should call setMessage when typing in input', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/write a comment/i);
    fireEvent.change(input, { target: { value: 'New comment' } });
    expect(mockActions.setMessage).toHaveBeenCalledWith('New comment');
  });

  it('should call handleSendMessage when Enter key is pressed', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/write a comment/i);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockActions.handleSendMessage).toHaveBeenCalled();
  });

  it('should disable Post button when sending is true', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, sending: true },
      actions: mockActions,
    });
    renderComponent();
    // Find the button that contains the text "Sending"
    const postButton = screen.getByText(/sending/i).closest('button');
    expect(postButton).toBeDisabled();
  });

  it('should disable Post button when message is empty', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, message: '' },
      actions: mockActions,
    });
    renderComponent();
    const postButton = screen.getByText(/post/i).closest('button');
    expect(postButton).toBeDisabled();
  });

  it('should enable Post button when message is not empty', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, message: 'Some comment' },
      actions: mockActions,
    });
    renderComponent();
    const postButton = screen.getByText(/post/i).closest('button');
    expect(postButton).not.toBeDisabled();
  });

  it('should show "Unknown mountain" when mountain is undefined', () => {
    (useBoardChatPageModule.useBoardChatPage as any).mockReturnValue({
      state: { ...mockState, mountain: undefined },
      actions: mockActions,
    });
    renderComponent();
    expect(screen.getByText(/Mountain: Unknown mountain/)).toBeInTheDocument();
  });
});