// Example: RESTful User Controller Implementation
// Demonstrates semantic HTTP method usage with proper status codes

class UserController {
  // GET: Retrieve data (safe, idempotent)
  async getUsers(req, res) {
    const users = await userService.findAll(req.query);
    res.status(200).json({
      data: users,
      meta: {
        total: users.length,
        page: parseInt(req.query.page || 1),
        limit: parseInt(req.query.limit || 20)
      }
    });
  }

  // POST: Create new resource (not idempotent)
  async createUser(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details
        });
      } else {
        res.status(500).json({
          error: 'Internal server error'
        });
      }
    }
  }

  // PUT: Update entire resource (idempotent)
  async updateUser(req, res) {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  }

  // PATCH: Partial update (idempotent)
  async patchUser(req, res) {
    const user = await userService.partialUpdate(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  }

  // DELETE: Remove resource (idempotent)
  async deleteUser(req, res) {
    const deleted = await userService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(204).send(); // No content for successful deletion
  }
}