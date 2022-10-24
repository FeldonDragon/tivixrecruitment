import { render, screen } from '@testing-library/react';
import App from '../components/App';
import questionMark from '../assets/images/questionMark.png';

// ERROR: "SyntaxError: Cannot use import statement outside a module" in "mainUtils.tsx"

it('renders question mark imgs', () => {
  render(App());
  // const testImage = document.querySelector("img") as HTMLImageElement;
  // expect(testImage.alt).toContain(questionMark);
});