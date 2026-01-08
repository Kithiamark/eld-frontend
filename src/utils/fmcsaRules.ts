/**
 * FMCSA Rules and Compliance Utilities
 * Implements Hours of Service (HOS) rules and validation
 */

import { HOS_LIMITS } from './constants';
import { LogEntry, DutyStatus, Violation } from '@/types/log';
import { differenceInMinutes, parseISO } from 'date-fns';

/**
 * Calculate remaining hours for drive time
 */
export const calculateDriveTimeRemaining = (
  logs: LogEntry[],
  currentTime: Date = new Date()
): number => {
  const last14Hours = logs.filter((log) => {
    const logTime = parseISO(log.start_time);
    const diff = differenceInMinutes(currentTime, logTime);
    return diff <= 14 * 60; // Last 14 hours
  });

  const drivingMinutes = last14Hours
    .filter((log) => log.duty_status === 'driving')
    .reduce((total, log) => {
      const duration = log.duration_minutes || 0;
      return total + duration;
    }, 0);

  const remainingMinutes = HOS_LIMITS.DRIVE_TIME * 60 - drivingMinutes;
  return Math.max(0, remainingMinutes / 60);
};

/**
 * Calculate remaining hours for shift time
 */
export const calculateShiftTimeRemaining = (
  logs: LogEntry[],
  currentTime: Date = new Date()
): number => {
  const last14Hours = logs.filter((log) => {
    const logTime = parseISO(log.start_time);
    const diff = differenceInMinutes(currentTime, logTime);
    return diff <= 14 * 60;
  });

  const onDutyMinutes = last14Hours
    .filter((log) => 
      log.duty_status === 'driving' || 
      log.duty_status === 'on_duty_not_driving'
    )
    .reduce((total, log) => {
      const duration = log.duration_minutes || 0;
      return total + duration;
    }, 0);

  const remainingMinutes = HOS_LIMITS.SHIFT_TIME * 60 - onDutyMinutes;
  return Math.max(0, remainingMinutes / 60);
};

/**
 * Calculate remaining hours for 70-hour/8-day cycle
 */
export const calculateCycleTimeRemaining = (
  logs: LogEntry[],
  cycleType: 60 | 70 = 70,
  currentTime: Date = new Date()
): number => {
  const days = cycleType === 70 ? 8 : 7;
  const lastNDays = logs.filter((log) => {
    const logTime = parseISO(log.start_time);
    const diff = differenceInMinutes(currentTime, logTime);
    return diff <= days * 24 * 60;
  });

  const onDutyMinutes = lastNDays
    .filter((log) => 
      log.duty_status === 'driving' || 
      log.duty_status === 'on_duty_not_driving'
    )
    .reduce((total, log) => {
      const duration = log.duration_minutes || 0;
      return total + duration;
    }, 0);

  const cycleLimit = cycleType * 60; // Convert to minutes
  const remainingMinutes = cycleLimit - onDutyMinutes;
  return Math.max(0, remainingMinutes / 60);
};

/**
 * Calculate time until 30-minute break is required
 */
export const calculateBreakRequired = (
  logs: LogEntry[],
  currentTime: Date = new Date()
): number => {
  // Find the last off-duty or sleeper berth period of at least 30 minutes
  let lastBreakTime: Date | null = null;
  
  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    if (
      (log.duty_status === 'off_duty' || log.duty_status === 'sleeper_berth') &&
      (log.duration_minutes || 0) >= 30
    ) {
      lastBreakTime = parseISO(log.start_time);
      break;
    }
  }

  if (!lastBreakTime) {
    // No recent break found, need break immediately after 8 hours
    const firstDrivingLog = logs.find((log) => log.duty_status === 'driving');
    if (firstDrivingLog) {
      const minutesSinceStart = differenceInMinutes(
        currentTime,
        parseISO(firstDrivingLog.start_time)
      );
      const remainingMinutes = 8 * 60 - minutesSinceStart;
      return Math.max(0, remainingMinutes);
    }
    return 8 * 60; // Full 8 hours available
  }

  // Calculate driving time since last break
  const logsSinceBreak = logs.filter((log) => {
    const logTime = parseISO(log.start_time);
    return logTime > lastBreakTime!;
  });

  const drivingMinutesSinceBreak = logsSinceBreak
    .filter((log) => log.duty_status === 'driving')
    .reduce((total, log) => total + (log.duration_minutes || 0), 0);

  const remainingMinutes = 8 * 60 - drivingMinutesSinceBreak;
  return Math.max(0, remainingMinutes);
};

/**
 * Check for HOS violations
 */
export const checkViolations = (
  logs: LogEntry[],
  currentTime: Date = new Date()
): Violation[] => {
  const violations: Violation[] = [];

  // Check drive time violation
  const driveTimeRemaining = calculateDriveTimeRemaining(logs, currentTime);
  if (driveTimeRemaining <= 0) {
    violations.push({
      id: `violation_${Date.now()}_drive`,
      type: 'drive_time_exceeded',
      description: '11-hour driving limit exceeded',
      timestamp: currentTime.toISOString(),
      severity: 'critical',
      regulation_reference: '49 CFR 395.3(a)(1)',
    });
  }

  // Check shift time violation
  const shiftTimeRemaining = calculateShiftTimeRemaining(logs, currentTime);
  if (shiftTimeRemaining <= 0) {
    violations.push({
      id: `violation_${Date.now()}_shift`,
      type: 'shift_time_exceeded',
      description: '14-hour on-duty limit exceeded',
      timestamp: currentTime.toISOString(),
      severity: 'critical',
      regulation_reference: '49 CFR 395.3(a)(2)',
    });
  }

  // Check cycle time violation
  const cycleTimeRemaining = calculateCycleTimeRemaining(logs, 70, currentTime);
  if (cycleTimeRemaining <= 0) {
    violations.push({
      id: `violation_${Date.now()}_cycle`,
      type: 'cycle_time_exceeded',
      description: '70-hour/8-day cycle limit exceeded',
      timestamp: currentTime.toISOString(),
      severity: 'major',
      regulation_reference: '49 CFR 395.3(b)',
    });
  }

  // Check break requirement
  const breakRequired = calculateBreakRequired(logs, currentTime);
  if (breakRequired <= 0) {
    violations.push({
      id: `violation_${Date.now()}_break`,
      type: 'break_required',
      description: '30-minute break required after 8 hours of driving',
      timestamp: currentTime.toISOString(),
      severity: 'major',
      regulation_reference: '49 CFR 395.3(a)(3)(ii)',
    });
  }

  return violations;
};

/**
 * Calculate when 34-hour reset will be eligible
 */
export const calculateResetEligibility = (
  logs: LogEntry[],
  currentTime: Date = new Date()
): Date | null => {
  // Find the last off-duty or sleeper berth period
  const recentOffDuty = logs
    .filter((log) => 
      log.duty_status === 'off_duty' || 
      log.duty_status === 'sleeper_berth'
    )
    .sort((a, b) => 
      parseISO(b.start_time).getTime() - parseISO(a.start_time).getTime()
    );

  if (recentOffDuty.length === 0) {
    return null;
  }

  const lastOffDuty = recentOffDuty[0];
  const offDutyStart = parseISO(lastOffDuty.start_time);
  
  // Add 34 hours to the start of off-duty period
  const resetEligible = new Date(offDutyStart.getTime() + 34 * 60 * 60 * 1000);
  
  return resetEligible > currentTime ? resetEligible : currentTime;
};

/**
 * Validate log entry against FMCSA rules
 */
export const validateLogEntry = (
  entry: Partial<LogEntry>,
  existingLogs: LogEntry[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!entry.driver_id) errors.push('Driver ID is required');
  if (!entry.vehicle_id) errors.push('Vehicle ID is required');
  if (!entry.duty_status) errors.push('Duty status is required');
  if (!entry.start_time) errors.push('Start time is required');
  if (!entry.location) errors.push('Location is required');
  if (entry.odometer === undefined) errors.push('Odometer reading is required');

  // Check for overlapping log entries
  if (entry.start_time && existingLogs.length > 0) {
    const entryStart = parseISO(entry.start_time);
    const overlapping = existingLogs.some((log) => {
      const logStart = parseISO(log.start_time);
      const logEnd = log.end_time ? parseISO(log.end_time) : new Date();
      return entryStart >= logStart && entryStart < logEnd;
    });

    if (overlapping) {
      errors.push('Log entry overlaps with existing entry');
    }
  }

  // Check if driving status is valid (not when off-duty)
  if (entry.duty_status === 'driving' && entry.odometer) {
    const lastLog = existingLogs[existingLogs.length - 1];
    if (lastLog && entry.odometer < lastLog.odometer) {
      errors.push('Odometer reading cannot decrease');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate total hours by duty status for a period
 */
export const calculateHoursByStatus = (
  logs: LogEntry[]
): Record<DutyStatus, number> => {
  const hours: Record<string, number> = {
    off_duty: 0,
    sleeper_berth: 0,
    driving: 0,
    on_duty_not_driving: 0,
    personal_conveyance: 0,
    yard_moves: 0,
  };

  logs.forEach((log) => {
    const duration = (log.duration_minutes || 0) / 60;
    hours[log.duty_status] += duration;
  });

  return hours as Record<DutyStatus, number>;
};