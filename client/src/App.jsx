import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<h1 className="text-3xl font-bold text-blue-600">E-Commerce App Scaffolded!</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
