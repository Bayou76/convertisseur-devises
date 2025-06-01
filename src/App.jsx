import { Container } from '@mui/material';
import CurrencyConverter from './components/CurrencyConverter';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Container>
      <ThemeToggle />
      <CurrencyConverter />
    </Container>
  );
}

export default App;
