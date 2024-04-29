import * as React from 'react';

import ReduxProvider from '@/components/ReduxProvider';
import AppNavigator from 'AppNavigator';

function App() {
  return (
    <ReduxProvider>
      <AppNavigator />
    </ReduxProvider>
  );
}

export default App;
