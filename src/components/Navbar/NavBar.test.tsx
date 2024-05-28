import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './Navbar';


test('renders the NavBar component with the correct links', () => {
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

  const homeLink = screen.getByText(/HOME/i);
  const postsLink = screen.getByText(/TODOs/i);

  expect(homeLink).toBeInTheDocument();
  expect(postsLink).toBeInTheDocument();
});

test('navigates to the correct pages', () => {
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

  const homeLink = screen.getByText(/HOME/i);
  const postsLink = screen.getByText(/TODOs/i);

  // Check if the links are in the document
  expect(homeLink).toBeInTheDocument();
  expect(postsLink).toBeInTheDocument();

  fireEvent.click(homeLink);
  expect(window.location.pathname).toBe('/');

  fireEvent.click(postsLink);
  expect(window.location.pathname).toBe('/posts');
});