import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../client/App';

test('renders home page', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  const screenElement = screen.getByText(/I am Home page/i);
  expect(screenElement).toBeInTheDocument();
});
