import React from 'react';
import {ExtensionProvider40} from '@looker/extension-sdk-react';
import {ComponentsProvider} from '@looker/components';
import {ScheduleHistory} from './ScheduleHistory';

export const App: React.FC = () => {
  return (
    <ExtensionProvider40>
      <ComponentsProvider>
        <ScheduleHistory />
      </ComponentsProvider>
    </ExtensionProvider40>
  );
};
