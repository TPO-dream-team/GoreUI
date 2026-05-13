import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BoardPage from './BoardPage'
import { useBoardPage } from './useBoardPage'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('./useBoardPage')

// Mocking Lucide icons to avoid unnecessary overhead in tests
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return { ...actual };
});

describe('BoardPage Component', () => {
  const mockActions = {
    handleDialogChange: vi.fn(),
    handleMountainQueryChange: vi.fn(),
    setmountainSuggestion: vi.fn(),
    handleSelectMountain: vi.fn(),
    setDate: vi.fn(),
    setDuration: vi.fn(),
    setDifficulty: vi.fn(),
    handleDescriptionChange: vi.fn(),
    handleCreatePost: vi.fn(),
  }

  const mockState = {
    open: false,
    boards: [],
    boardsLoading: false,
    boardsError: "",
    creatingBoard: false,
    mountainQuery: "",
    mountainSuggestion: false,
    description: "",
    date: "",
    duration: "",
    difficulty: "",
    formError: "",
    filteredMountains: [],
    selectedMountain: null,
    gore: []
  }

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  })

  it('renders the "New Style" (Mountain Theme) by default', () => {
    (useBoardPage as any).mockReturnValue({ state: mockState, actions: mockActions })
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )
    // The new style uses "New tour" instead of "Create new tour"
    expect(screen.getByText('New tour')).toBeInTheDocument()
    expect(screen.getByText('Browse published hikes')).toBeInTheDocument()
  })

  it('shows loading spinner when boardsLoading is true', () => {
    const loadingState = { ...mockState, boardsLoading: true };
    (useBoardPage as any).mockReturnValue({ state: loadingState, actions: mockActions })
    
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Loading tours.../i)).toBeInTheDocument()
  })

  it('triggers mountain search when typing in the dialog', () => {
    const openState = { ...mockState, open: true };
    (useBoardPage as any).mockReturnValue({ state: openState, actions: mockActions })
    
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Enter mountain name/i)
    fireEvent.change(input, { target: { value: 'Triglav' } })
    
    expect(mockActions.handleMountainQueryChange).toHaveBeenCalledWith('Triglav')
  })

  it('renders a list of boards when data is provided', () => {
    const populatedState = {
      ...mockState,
      boards: [
        {
          boardId: '1',
          mountainId: '101',
          expiryDate: '2026-06-01',
          tourTime: 5,
          username: 'HikerDave',
          description: 'Fun hike',
          difficulty: 3,
          userId: 'user1'
        }
      ],
      gore: [{ id: '101', name: 'Mount Everest', height: 8848 }]
    };
    (useBoardPage as any).mockReturnValue({ state: populatedState, actions: mockActions })

    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Mount Everest')).toBeInTheDocument()
    expect(screen.getByText('HikerDave')).toBeInTheDocument()
  })

  it('displays form errors within the dialog', () => {
    const errorState = { ...mockState, open: true, formError: "Please select a mountain" };
    (useBoardPage as any).mockReturnValue({ state: errorState, actions: mockActions })

    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )

    expect(screen.getByText("Please select a mountain")).toBeInTheDocument()
  })
})