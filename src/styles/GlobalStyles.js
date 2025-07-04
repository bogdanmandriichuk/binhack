import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #007BFF;
    --secondary-color: #28a745;
    --background-color: #f0f2f5;
    --card-background: #ffffff;
    --text-color: #333;
    --text-color-secondary: #6c757d;
    --border-color: #dee2e6;
    --button-hover-bg: #e2e6ea;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyles;