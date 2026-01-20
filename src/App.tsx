import React from 'react';
import { ExtensionProvider } from '@looker/extension-sdk-react';
import { ComponentsProvider } from '@looker/components';
import { ScheduleHistory } from './ScheduleHistory';

export const App: React.FC = () => {
  return (
    <ExtensionProvider>
      <ComponentsProvider>
        <ScheduleHistory />
      </ComponentsProvider>
    </ExtensionProvider>
  );
};
