import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BoardPage from './BoardPage'
import { useBoardPage } from './useBoardPage'
import { vi, describe, it, expect } from 'vitest'

vi.mock('./useBoardPage')

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

  it('renders the page title', () => {
    (useBoardPage as any).mockReturnValue({ state: mockState, actions: mockActions })
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Tours')).toBeInTheDocument()
  })

  it('shows empty state message when no boards exist', () => {
    (useBoardPage as any).mockReturnValue({ state: mockState, actions: mockActions })
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/no tours/i)).toBeInTheDocument()
  })

  it('opens dialog when "Create new tour" is clicked', () => {
    (useBoardPage as any).mockReturnValue({ state: mockState, actions: mockActions })
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )
    
    const btn = screen.getByText('Create new tour')
    fireEvent.click(btn)
    
    // Check if hook action was triggered
    expect(mockActions.handleDialogChange).toHaveBeenCalledWith(true)
  })

  it('displays an error message when state.boardsError is present', () => {
    const errorState = { ...mockState, boardsError: "Failed to fetch" };
    (useBoardPage as any).mockReturnValue({ state: errorState, actions: mockActions })
    
    render(
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument()
  })
})