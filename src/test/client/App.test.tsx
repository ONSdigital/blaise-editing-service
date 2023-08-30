import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../client/App';

describe('Renders the login screen when the user first vists the page', () => {
  it('Should display a message asking the user to enter their Blaise user credentials', () => {
  // act
    render(<BrowserRouter><App /></BrowserRouter>);
    const screenElement = screen.getByText(/Enter your Blaise username and password/i);

    // assert
    expect(screenElement).toBeInTheDocument();
  });
});
