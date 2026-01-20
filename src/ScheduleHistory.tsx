import React, {useEffect, useState} from 'react';
import {ExtensionContext40} from '@looker/extension-sdk-react';
import {
  Box,
  Button,
  ButtonGroup,
  FieldText,
  Space,
  Spinner,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@looker/components';
import {IScheduledPlan} from '@looker/sdk';

type FilterType = 'all' | 'in_progress' | 'success' | 'failure';

export const ScheduleHistory: React.FC = () => {
  const { core40SDK } = React.useContext(ExtensionContext);
  const [scheduleId, setScheduleId] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [schedules, setSchedules] = useState<IScheduledPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);

    try {
      if (scheduleId) {
        const result = await core40SDK.ok(core40SDK.scheduled_plan(scheduleId));
        setSchedules([result]);
      } else {
        const result = await core40SDK.ok(core40SDK.all_scheduled_plans());
        setSchedules(result);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, [scheduleId]);

  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'all') {
      return true;
    }

    const lastStatus = schedule.last_run_status;

    if (filter === 'in_progress') {
      return lastStatus === 'in_progress';
    }

    if (filter === 'success') {
      return lastStatus === 'success';
    }

    if (filter === 'failure') {
      return lastStatus === 'failure' || lastStatus === 'error';
    }

    return true;
  });

  return (
    <Box p="large">
      <Space>
        <FieldText
          label="Schedule ID (optional)"
          value={scheduleId}
          onChange={(e) => setScheduleId(e.target.value)}
          placeholder="Leave empty for all schedules"
        />
        <Button onClick={fetchSchedules}>Refresh</Button>
      </Space>
      
      <Box mt="medium">
        <ButtonGroup value={filter} onChange={setFilter}>
          <Button value="all">All</Button>
          <Button value="in_progress">Running</Button>
          <Button value="success">Successful</Button>
          <Button value="failure">Failure</Button>
        </ButtonGroup>
      </Box>

      {loading ? (<Box mt="large"><Spinner /></Box>) : (
        <Box mt="large">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Last Run</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSchedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableDataCell>{schedule.id}</TableDataCell>
                  <TableDataCell>{schedule.name}</TableDataCell>
                  <TableDataCell>{schedule.last_run_at || 'Never'}</TableDataCell>
                  <TableDataCell>{schedule.last_run_status || 'N/A'}</TableDataCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </Box>)}
    </Box>);
};
