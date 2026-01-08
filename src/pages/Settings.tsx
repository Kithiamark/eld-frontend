/**
 * Settings Page
 * Application settings and preferences
 */

import React, { useState } from 'react';
import { Save, Bell, Globe, Lock, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Checkbox from '@/components/common/Checkbox';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useToast } from '@/hooks/useToast';

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const { addToast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    violations: true,
    inspections: true,
  });

  const handleSaveProfile = () => {
    addToast('Profile updated successfully', 'success');
  };

  const handleSaveNotifications = () => {
    addToast('Notification preferences saved', 'success');
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </Card.Footer>
        </Card>

        {/* Appearance */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <Checkbox
              id="darkMode"
              label="Dark Mode"
              description="Use dark theme across the application"
              checked={isDark}
              onChange={toggleTheme}
            />
          </Card.Body>
        </Card>

        {/* Notifications */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <Checkbox
                id="emailNotifications"
                label="Email Notifications"
                description="Receive notifications via email"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
              />
              <Checkbox
                id="pushNotifications"
                label="Push Notifications"
                description="Receive push notifications on your device"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
              />
              <Checkbox
                id="violationNotifications"
                label="HOS Violations"
                description="Get notified when HOS violations occur"
                checked={notifications.violations}
                onChange={(e) =>
                  setNotifications({ ...notifications, violations: e.target.checked })
                }
              />
              <Checkbox
                id="inspectionNotifications"
                label="Inspection Reminders"
                description="Receive reminders for upcoming inspections"
                checked={notifications.inspections}
                onChange={(e) =>
                  setNotifications({ ...notifications, inspections: e.target.checked })
                }
              />
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveNotifications}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Preferences
              </Button>
            </div>
          </Card.Footer>
        </Card>

        {/* Security */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Change Password
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Update your password to keep your account secure
                </p>
                <Button variant="secondary">Change Password</Button>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="secondary">Enable 2FA</Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <Card.Header>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="danger">Delete Account</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;