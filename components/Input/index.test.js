import { render, screen } from '@testing-library/react';
import Input from './index';

describe('Input', () => {
  it('renders empty Input box without crashing', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
