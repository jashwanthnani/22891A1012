import React from "react";
import Shortener from "./components/Shortener";
import Stats from "./components/Stats";
import { Container, Box, Divider } from "@mui/material";

function App() {
  return (
    <Container>
      <Box sx={{ mt: 3 }}>
        <Shortener />
        <Divider sx={{ my: 4 }} />
        <Stats />
      </Box>
    </Container>
  );
}

export default App;
