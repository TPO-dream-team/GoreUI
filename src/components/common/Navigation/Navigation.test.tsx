import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navigation } from './Navigation'
import { useNavigation } from './useNavigation'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('./useNavigation')

describe('Navigation Component', () => {
  const mockNavigate = vi.fn()
  
  const defaultMockValues = {
    username: null,
    role: null,
    id: "1",
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

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  })

  it('renders the brand name "PeakProof"', () => {
    (useNavigation as any).mockReturnValue(defaultMockValues)
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    const brandElements = screen.getAllByText(/PeakProof/i)
    expect(brandElements.length).toBeGreaterThan(0)
  })

  it('shows Login and Registration buttons when user is NOT logged in', () => {
    (useNavigation as any).mockReturnValue(defaultMockValues)
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    // Changed "register" to "registration" to match your new UI label
    expect(screen.getByRole('button', { name: /registration/i })).toBeInTheDocument()
  })

  it('shows the username and hides Registration button when user IS logged in', () => {
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
    expect(screen.queryByRole('button', { name: /registration/i })).not.toBeInTheDocument()
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

    const loadingBtn = screen.getByRole('button', { name: /logging in.../i })
    expect(loadingBtn).toBeInTheDocument()
    expect(loadingBtn).toBeDisabled()
  })

  it('toggles the style when the palette button is clicked', () => {
    (useNavigation as any).mockReturnValue(defaultMockValues)
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByTitle(/toggle style|switch to/i)
    fireEvent.click(toggleBtn)

    expect(localStorage.getItem("useNewStyle")).toBe("false")
  })
})