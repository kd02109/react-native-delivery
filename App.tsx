import * as React from 'react';

import ReduxProvider from '@/components/ReduxProvider';
import AppNavigator from 'AppNavigator';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://8428cf35f98b031523764b6f2a11f108@o4507110752911360.ingest.us.sentry.io/4507327827148800',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
});

function App() {
  return (
    <ReduxProvider>
      <AppNavigator />
    </ReduxProvider>
  );
}

export default Sentry.wrap(App);
