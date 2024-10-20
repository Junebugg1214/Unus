import React from 'react';
import UnusUI from './components/UnusUI';
import { AppProvider } from './AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="App">
        <UnusUI />
      </div>
    </AppProvider>
  );
}

export default App;