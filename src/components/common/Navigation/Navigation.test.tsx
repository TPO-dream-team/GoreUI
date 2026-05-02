import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navigation } from './Navigation'
import { useNavigation } from './useNavigation'
import { vi, describe, it, expect } from 'vitest'

vi.mock('./useNavigation')

describe('Navigation Component', () => {
  const mockNavigate = vi.fn()
  
  const defaultMockValues = {
    username: null,
    role: null,
    navigate: mockNavigate,
    loginLoading: false,
    loginDialogOpen: false,
    loginInfoText: "",
    setLoginUsername: vi.fn(),
    setLoginPassword: vi.fn(),
    handleLoginDialogOpen: vi.fn(),
    handleLogin: vi.fn((e) => e.preventDefault()),
    signUpLoading: false,
    signUpDialogOpen: false,
    signupInfoText: "",
    setSignupUsername: vi.fn(),
    setSignupPassword1: vi.fn(),
    setSignupPassword2: vi.fn(),
    handleSignupDialogOpen: vi.fn(),
    handleSignUp: vi.fn((e) => e.preventDefault()),
    handleLogoutBtn: vi.fn(),
  }

  it('renders the brand name "PeakProof"', () => {
    (useNavigation as any).mockReturnValue(defaultMockValues)
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    expect(screen.getByText('PeakProof')).toBeInTheDocument()
  })

  it('shows Login and Register buttons when user is NOT logged in', () => {
    (useNavigation as any).mockReturnValue(defaultMockValues)
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('shows the username and hides Register button when user IS logged in', () => {
    (useNavigation as any).mockReturnValue({
      ...defaultMockValues,
      username: 'TestUser123'
    })
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    expect(screen.getByText('TestUser123')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument()
  })

  it('displays login error message when loginInfoText is provided', () => {
    (useNavigation as any).mockReturnValue({
      ...defaultMockValues,
      loginDialogOpen: true, 
      loginInfoText: "Invalid credentials"
    })

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('shows "Logging in..." text on button when login is loading', () => {
    (useNavigation as any).mockReturnValue({
      ...defaultMockValues,
      loginDialogOpen: true,
      loginLoading: true
    })

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    expect(screen.getByText('Logging in...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled()
  })
})