import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../client/App';

describe('Renders the home page correctly', () => {
  it('Should display a welcome message', () => {
  // act
    render(<BrowserRouter><App /></BrowserRouter>);
    const screenElement = screen.getByText(/I am Home page/i);

    // assert
    expect(screenElement).toBeInTheDocument();
  });
});
