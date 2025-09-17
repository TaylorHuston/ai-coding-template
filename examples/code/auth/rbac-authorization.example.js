/**
 * Role-Based Access Control (RBAC) Implementation Example
 *
 * Comprehensive RBAC system with hierarchical roles, wildcard permissions,
 * and audit trail
 *
 * Features:
 * - Hierarchical role structure
 * - Wildcard permission matching
 * - Role assignment validation
 * - Audit trail logging
 * - Express.js middleware integration
 */

class RBACAuthorizationService {
  constructor(roleRepository, permissionRepository, auditService) {
    this.roles = roleRepository;
    this.permissions = permissionRepository;
    this.audit = auditService;
  }

  async hasPermission(userId, resource, action) {
    const userRoles = await this.getUserRoles(userId);
    const requiredPermission = `${resource}:${action}`;

    for (const role of userRoles) {
      const rolePermissions = await this.getRolePermissions(role.id);

      if (this.permissionMatches(rolePermissions, requiredPermission)) {
        await this.audit.logPermissionCheck(userId, requiredPermission, true, role.name);
        return true;
      }
    }

    await this.audit.logPermissionCheck(userId, requiredPermission, false);
    return false;
  }

  permissionMatches(userPermissions, requiredPermission) {
    return userPermissions.some(permission => {
      // Support wildcard permissions
      if (permission.includes('*')) {
        const pattern = permission.replace('*', '.*');
        return new RegExp(`^${pattern}$`).test(requiredPermission);
      }

      return permission === requiredPermission;
    });
  }

  async assignRole(userId, roleId, context = {}) {
    // Check if user can assign this role
    const canAssign = await this.hasPermission(
      context.assignedBy,
      'roles',
      'assign'
    );

    if (!canAssign) {
      throw new AuthorizationError('Insufficient permissions to assign role');
    }

    // Check role hierarchy constraints
    const assignerRoles = await this.getUserRoles(context.assignedBy);
    const targetRole = await this.getRoleById(roleId);

    if (!this.canAssignRole(assignerRoles, targetRole)) {
      throw new AuthorizationError('Cannot assign role with equal or higher privileges');
    }

    await this.roles.assignUserRole(userId, roleId);

    // Audit trail
    await this.auditRoleAssignment(userId, roleId, context);
  }

  canAssignRole(assignerRoles, targetRole) {
    const maxAssignerLevel = Math.max(
      ...assignerRoles.map(role => role.hierarchyLevel)
    );

    return targetRole.hierarchyLevel < maxAssignerLevel;
  }

  async createRoleHierarchy() {
    const hierarchy = {
      'super_admin': {
        level: 10,
        permissions: ['*'],
        inherits: []
      },
      'admin': {
        level: 8,
        permissions: [
          'users:*',
          'roles:read',
          'reports:*'
        ],
        inherits: ['moderator']
      },
      'moderator': {
        level: 5,
        permissions: [
          'content:*',
          'users:read',
          'users:suspend'
        ],
        inherits: ['user']
      },
      'user': {
        level: 1,
        permissions: [
          'profile:read',
          'profile:update',
          'content:read',
          'content:create'
        ],
        inherits: []
      }
    };

    return hierarchy;
  }

  async revokeRole(userId, roleId, context = {}) {
    // Check if user can revoke this role
    const canRevoke = await this.hasPermission(
      context.revokedBy,
      'roles',
      'revoke'
    );

    if (!canRevoke) {
      throw new AuthorizationError('Insufficient permissions to revoke role');
    }

    await this.roles.revokeUserRole(userId, roleId);

    // Audit trail
    await this.auditRoleRevocation(userId, roleId, context);
  }

  async getUserEffectivePermissions(userId) {
    const userRoles = await this.getUserRoles(userId);
    const allPermissions = new Set();

    for (const role of userRoles) {
      const rolePermissions = await this.getRolePermissions(role.id);
      const inheritedPermissions = await this.getInheritedPermissions(role.id);

      rolePermissions.forEach(permission => allPermissions.add(permission));
      inheritedPermissions.forEach(permission => allPermissions.add(permission));
    }

    return Array.from(allPermissions);
  }

  async getInheritedPermissions(roleId) {
    const role = await this.getRoleById(roleId);
    const inheritedPermissions = new Set();

    if (role.inherits && role.inherits.length > 0) {
      for (const inheritedRoleId of role.inherits) {
        const permissions = await this.getRolePermissions(inheritedRoleId);
        const nestedInherited = await this.getInheritedPermissions(inheritedRoleId);

        permissions.forEach(permission => inheritedPermissions.add(permission));
        nestedInherited.forEach(permission => inheritedPermissions.add(permission));
      }
    }

    return Array.from(inheritedPermissions);
  }

  async checkResourceOwnership(userId, resourceId, resourceType) {
    // Check if user owns the resource
    const resource = await this.getResource(resourceType, resourceId);

    if (!resource) {
      throw new ResourceNotFoundError(`${resourceType} not found`);
    }

    return resource.ownerId === userId;
  }

  async auditRoleAssignment(userId, roleId, context) {
    const role = await this.getRoleById(roleId);
    const user = await this.getUserById(userId);

    await this.audit.log({
      action: 'role_assigned',
      userId: userId,
      userName: user.name,
      roleId: roleId,
      roleName: role.name,
      assignedBy: context.assignedBy,
      timestamp: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async auditRoleRevocation(userId, roleId, context) {
    const role = await this.getRoleById(roleId);
    const user = await this.getUserById(userId);

    await this.audit.log({
      action: 'role_revoked',
      userId: userId,
      userName: user.name,
      roleId: roleId,
      roleName: role.name,
      revokedBy: context.revokedBy,
      timestamp: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // Repository interface methods (to be implemented)
  async getUserRoles(userId) {
    // Implement user roles retrieval
    throw new Error('Not implemented');
  }

  async getRolePermissions(roleId) {
    // Implement role permissions retrieval
    throw new Error('Not implemented');
  }

  async getRoleById(roleId) {
    // Implement role retrieval
    throw new Error('Not implemented');
  }

  async getUserById(userId) {
    // Implement user retrieval
    throw new Error('Not implemented');
  }

  async getResource(resourceType, resourceId) {
    // Implement resource retrieval
    throw new Error('Not implemented');
  }
}

// Express.js middleware for RBAC
const requirePermission = (rbacService) => (resource, action) => {
  return async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const hasAccess = await rbacService.hasPermission(userId, resource, action);

      if (!hasAccess) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: `${resource}:${action}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Authorization check failed',
        message: error.message
      });
    }
  };
};

// Express.js middleware for resource ownership
const requireResourceOwnership = (rbacService) => (resourceType, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    const resourceId = req.params[resourceIdParam];

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const isOwner = await rbacService.checkResourceOwnership(userId, resourceId, resourceType);

      if (!isOwner) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only access your own resources'
        });
      }

      next();
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return res.status(404).json({
          error: 'Resource not found',
          message: error.message
        });
      }

      return res.status(500).json({
        error: 'Ownership check failed',
        message: error.message
      });
    }
  };
};

// Usage examples in Express.js routes
const setupRBACRoutes = (router, rbacService) => {
  const requirePerm = requirePermission(rbacService);
  const requireOwnership = requireResourceOwnership(rbacService);

  // Admin routes
  router.get('/admin/users',
    authenticate,
    requirePerm('users', 'list'),
    adminController.getUsers
  );

  router.delete('/admin/users/:id',
    authenticate,
    requirePerm('users', 'delete'),
    adminController.deleteUser
  );

  // Resource ownership routes
  router.get('/documents/:id',
    authenticate,
    requireOwnership('document'),
    documentController.getDocument
  );

  router.put('/documents/:id',
    authenticate,
    requireOwnership('document'),
    requirePerm('documents', 'update'),
    documentController.updateDocument
  );

  // Role management routes
  router.post('/users/:id/roles',
    authenticate,
    requirePerm('roles', 'assign'),
    roleController.assignRole
  );

  router.delete('/users/:id/roles/:roleId',
    authenticate,
    requirePerm('roles', 'revoke'),
    roleController.revokeRole
  );
};

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}

// Mock authenticate middleware (implement according to your auth strategy)
const authenticate = (req, res, next) => {
  // Implement authentication logic
  // Should set req.user with user information
  next();
};

module.exports = {
  RBACAuthorizationService,
  requirePermission,
  requireResourceOwnership,
  setupRBACRoutes,
  AuthorizationError,
  ResourceNotFoundError
};