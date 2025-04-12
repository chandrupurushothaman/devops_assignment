// UserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './UserManagement.css';

const UserManagement = (currentUser) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    department: '',
    password: '',
    confirmPassword: '',
    role:"",
  });
  const [modifiedFields, setModifiedFields] = useState({});


  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.20.52.99:4400/users?page=${currentPage}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const filteredUsers = data.filter(user => {
        return user.username !== currentUser.currentUser;
      });      
      setUsers(filteredUsers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      username: user.username,
      department: user.department,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setEditDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    if (name !== 'confirmPassword') {
      setModifiedFields({ ...modifiedFields, [name]: value });
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editForm.password || editForm.confirmPassword) {
      if (editForm.password !== editForm.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(editForm.password)) {
        alert('Password must meet security requirements');
        return;
      }
    }

    const document = {};
    for (const [key, value] of Object.entries(modifiedFields)) {
      if (key !== 'username' && value !== selectedUser[key]) {
        document[key] = value;
      }
    }
    if (editForm.role !== selectedUser .role) {
      document.role = editForm.role;
  }

    if (Object.keys(document).length === 0) {
      alert('No changes detected');
      return;
    }

    try {
      const response = await fetch(`http://10.20.52.99:4400/edit_user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedUser.username,
          document: document
        }),
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      const updatedUsers = users.map(user => 
        user.username === selectedUser.username 
          ? { ...user, ...document }
          : user
      );
      setUsers(updatedUsers);
      setEditDialogOpen(false);
      alert('User updated successfully');
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  const handleConfirmDelete = async () => {
  try {
    const response = await fetch('http://10.20.52.99:4400/delete_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: selectedUser["username"]  }),
    });

    if (!response.ok) throw new Error('Failed to delete user');
    const updatedUsers = users.filter(user => user.username !== selectedUser );
    setUsers(updatedUsers);
    setDeleteDialogOpen(false);
    alert('User deleted successfully');
  } catch (error) {
    alert('Error deleting user: ' + error.message);
  }
  await fetchUsers();
};

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  

  const filteredUsers = users.filter(user =>
    user.username !== currentUser  && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * direction;
    if (a[sortField] > b[sortField]) return 1 * direction;
    return 0;
  });

  return (
    <div className="user-management-container">
      <div className="user-management-card">
        <h1 className="user-management-title">Manage Users</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="users-table-header">
          <div className="header-cell" onClick={() => handleSort('name')}>
            Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="header-cell" onClick={() => handleSort('username')}>
            Email {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="header-cell" onClick={() => handleSort('department')}>
            Department {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
          </div>
          <div className="header-cell">Actions</div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="users-list">
            {sortedUsers.map(user => (
              <div key={user.id} className="user-row">
                <div className="user-cell">{user.name}</div>
                <div className="user-cell">{user.username}</div>
                <div className="user-cell">{user.department}</div>
                <div className="user-cell actions">
                  <button className="edit-button" onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteClick(user)}>
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          className="edit-dialog"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>

<DialogContent>
        <TextField
            margin="dense"
            name="username" // Ensure the name attribute is set
            label="Username"
            type="email"
            fullWidth
            value={editForm.username}
            InputProps={{
                readOnly: true,
            }}
        />
        <TextField
            autoFocus
            margin="dense"
            name="name" // Ensure the name attribute is set correctly
            label="Name"
            type="text"
            fullWidth
            value={editForm.name}
            onChange={handleInputChange}
        />
        <TextField
            margin="dense"
            name="department"
            label="Department"
            type="text"
            fullWidth
            value={editForm.department}
            onChange={handleInputChange}
        />
        <TextField
            margin="dense"
            name="role"
            label="Role"
            select
            fullWidth
            value={editForm.role}
            onChange={handleInputChange}
            SelectProps={{
                native: true,
            }}
        >
            <option value="User ">User </option>
            <option value="Admin">Admin</option>
        </TextField>
        <TextField
            margin="dense"
            name="password"
            label="New Password (optional)"
            type="password"
            fullWidth
            value={editForm.password}
            onChange={handleInputChange}
        />
        <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={editForm.confirmPassword}
            onChange={handleInputChange}
        />
    </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          className="delete-dialog"
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete user {selectedUser?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;