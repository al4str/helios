import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <h1>Hello world</h1>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
