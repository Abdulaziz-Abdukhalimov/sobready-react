import Container from "@mui/material/Container";
import "../css/App.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <Container>
      <h1> Hello</h1>
      <Typography variant="h4" component={"h4"}>
        Aromatica App with react -vite
      </Typography>
      <Button variant="contained">Click</Button>
    </Container>
  );
}

export default App;
