import { renderHook, waitFor, act } from '@testing-library/react'
import { useBoardPage } from './useBoardPage'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/utility/axios'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mocking external dependencies
vi.mock('react-redux')
vi.mock('@/utility/axios')

describe('useBoardPage Hook', () => {
  const mockDispatch = vi.fn()
  const mockGore = [{ id: '1', name: 'Triglav', height: 2864 }]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDispatch as any).mockReturnValue(mockDispatch)
    ;(useSelector as any).mockReturnValue({ gore: mockGore, loading: false })
    ;(api.get as any).mockResolvedValue({ data: [] })
  })

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useBoardPage())
    expect(result.current.state.open).toBe(false)
    expect(result.current.state.mountainQuery).toBe("")
  })

  it('should filter mountains based on query', () => {
    const { result } = renderHook(() => useBoardPage())
    
    act(() => {
      result.current.actions.handleMountainQueryChange('Tri')
    })

    expect(result.current.state.filteredMountains).toHaveLength(1)
    expect(result.current.state.filteredMountains[0].name).toBe('Triglav')
  })

  it('should show validation error if form is submitted empty', async () => {
    const { result } = renderHook(() => useBoardPage())

    await act(async () => {
      await result.current.actions.handleCreatePost()
    })

    expect(result.current.state.formError).toBe("Select mountain from the list.")
  })

  it('should call api.post and reset form on successful creation', async () => {
    ;(api.post as any).mockResolvedValue({})
    const { result } = renderHook(() => useBoardPage())

    act(() => {
      result.current.actions.handleSelectMountain(mockGore[0])
      result.current.actions.setDate('2026-10-10')
      result.current.actions.setDuration('5')
      result.current.actions.setDifficulty('3')
      result.current.actions.handleDescriptionChange('Cool tour')
    })

    await act(async () => {
      await result.current.actions.handleCreatePost()
    })

    expect(api.post).toHaveBeenCalled()
    expect(result.current.state.open).toBe(false) // Dialog closed
  })
})

