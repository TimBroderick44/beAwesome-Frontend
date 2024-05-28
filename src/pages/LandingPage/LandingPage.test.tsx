import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  test('renders the landing page with correct content', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Todo: Be Awesome!/i)).toBeInTheDocument();
    expect(screen.getByText(/Time to start building on a better you!/i)).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });
});