import React from 'react';
import {ExtensionProvider40} from '@looker/extension-sdk-react';
import {ComponentsProvider40} from '@looker/components';
import {ScheduleHistory} from './ScheduleHistory';

export const App: React.FC = () => {
  return (
    <ExtensionProvider40>
      <ComponentsProvider40>
        <ScheduleHistory />
      </ComponentsProvider40>
    </ExtensionProvider40>
  );
};
