/**
 * Example React component implementation
 * 
 * This example demonstrates:
 * - Functional component with TypeScript
 * - Props interface definition
 * - State management with hooks
 * - Event handling patterns
 * - Conditional rendering
 * - Error handling in components
 * - Accessibility considerations
 */

import React, { useState, useCallback } from 'react';
import { User } from '../types/user';
import { Button } from './common/Button';
import { Avatar } from './common/Avatar';
import { Card } from './common/Card';
import { useToast } from '../hooks/useToast';

interface UserCardProps {
  /** User data to display */
  user: User;
  /** Whether the current user can edit this user */
  canEdit?: boolean;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Callback when user is edited */
  onEdit?: (user: User) => void;
  /** Callback when user is deleted */
  onDelete?: (userId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  canEdit = false,
  isLoading = false,
  onEdit,
  onDelete,
  className = '',
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleEdit = useCallback(() => {
    if (onEdit && !isLoading) {
      onEdit(user);
    }
  }, [onEdit, user, isLoading]);

  const handleDelete = useCallback(async () => {
    if (!onDelete || isLoading || isDeleting) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    
    try {
      await onDelete(user.id);
      showToast('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete, user, isLoading, isDeleting, showToast]);

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-4 p-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`transition-shadow hover:shadow-lg ${className}`}>
      <div className="p-6">
        {/* User Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              size="lg"
              fallback={user.name.charAt(0).toUpperCase()}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
              user.role
            )}`}
            aria-label={`User role: ${user.role}`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        {/* User Details */}
        <div className="space-y-2 mb-4">
          {user.department && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Department:</span> {user.department}
            </p>
          )}
          <p className="text-sm text-gray-600">
            <span className="font-medium">Joined:</span> {formatDate(user.createdAt)}
          </p>
          {user.lastLoginAt && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last login:</span> {formatDate(user.lastLoginAt)}
            </p>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center mb-4">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              user.isActive ? 'bg-green-400' : 'bg-gray-400'
            }`}
            aria-hidden="true"
          />
          <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-gray-500'}`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading || isDeleting}
              aria-label={`Edit ${user.name}`}
            >
              Edit
            </Button>
            
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
              loading={isDeleting}
              aria-label={`Delete ${user.name}`}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Usage example:
/*
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEditUser = (user: User) => {
    // Open edit modal or navigate to edit page
    console.log('Editing user:', user);
  };

  const handleDeleteUser = async (userId: string) => {
    // Delete user via API
    await userService.deleteUser(userId);
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          canEdit={true}
          isLoading={loading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      ))}
    </div>
  );
}
*/

export default UserCard;