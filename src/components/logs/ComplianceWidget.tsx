/**
 * Compliance Widget Component
 * Display compliance status and warnings
 */

import React from 'react';
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Card from '@/components/common/Card';
import { ComplianceData } from '@/types/log';
import { formatHours } from '@/utils/formatters';

interface ComplianceWidgetProps {
  compliance: ComplianceData;
  isLoading?: boolean;
}

const ComplianceWidget: React.FC<ComplianceWidgetProps> = ({
  compliance,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded" />
      </Card>
    );
  }

  const hasViolations = compliance.violations.length > 0;
  const isCompliant = compliance.is_compliant;

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <Card className={hasViolations ? 'border-red-200 dark:border-red-800' : ''}>
        <div className="flex items-center gap-3">
          {isCompliant ? (
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isCompliant ? 'Within Compliance' : 'Compliance Issues Detected'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hasViolations
                ? `${compliance.violations.length} violation(s) found`
                : 'All HOS requirements met'}
            </p>
          </div>
        </div>
      </Card>

      {/* Hours Summary */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hours Remaining
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Drive Time</span>
              <span className={`font-semibold ${
                compliance.hours_summary.drive_remaining < 2
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {formatHours(compliance.hours_summary.drive_remaining)} / 11h
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Shift Time</span>
              <span className={`font-semibold ${
                compliance.hours_summary.shift_remaining < 2
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {formatHours(compliance.hours_summary.shift_remaining)} / 14h
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cycle Time</span>
              <span className={`font-semibold ${
                compliance.hours_summary.cycle_remaining < 10
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {formatHours(compliance.hours_summary.cycle_remaining)} / 70h
              </span>
            </div>
          </div>

          {compliance.hours_summary.break_required_in <= 60 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Break Required Soon
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    30-minute break required in {compliance.hours_summary.break_required_in} minutes
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Violations */}
      {hasViolations && (
        <Card className="border-red-200 dark:border-red-800">
          <Card.Header>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Active Violations
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {compliance.violations.map((violation, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100">
                        {violation.type.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {violation.description}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        {violation.regulation_reference}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      violation.severity === 'critical'
                        ? 'bg-red-600 text-white'
                        : violation.severity === 'major'
                        ? 'bg-orange-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {violation.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ComplianceWidget;