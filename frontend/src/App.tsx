import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to UNUS</h1>
              <p className="text-lg text-muted-foreground">
                Your application is now running in {process.env['REACT_APP_ENV']} mode
              </p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;