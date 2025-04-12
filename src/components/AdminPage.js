import React, { useState, useEffect, useRef } from 'react';
import './AdminPage.css';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import * as XLSX from 'xlsx';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';

const AdminPage = () => {
  const [allocationData, setAllocation] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); // State for the user to delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    username: '',
    channelId: '',
    title: '',
    networkId: '',
    ipAddress: '',
    expiryDate: '',
    createdDate: '',
    useCase: ''
  });
  const [filterVisible, setFilterVisible] = useState({
    username: false,
    channelId: false,
    title: false,
    networkId: false,
    ipAddress: false,
    createdDate: false,
    expiryDate: false,
    useCase: false
  });
  const [showExpired, setShowExpired] = useState(false); 
  const inputRefs = useRef({});

  const downloadCSV = () => {
    const csvRows = [];
    const headers = Object.keys(allocationData[0]);
    csvRows.push(headers.join(',')); // Add header row

    for (const row of allocationData) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"'); // Escape double quotes
        return `"${escaped}"`; // Wrap in quotes
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'allocation_data.csv');
    a.click();
  };

  useEffect(() => {
    fetchAllocationData();
  }, []);

  const fetchAllocationData = async () => {
    try {
      const allocationResponse = await fetch(`http://10.20.52.99:4400/allocations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const allocationData = await allocationResponse.json();
      setAllocation(allocationData);
      console.log(allocationData);
    } catch (error) {
      console.error('Error fetching allocation data:', error);
      setAllocation([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const toggleFilterVisibility = (filterName) => {
    setFilterVisible((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));

    setTimeout(() => {
      if (!filterVisible[filterName]) {
        inputRefs.current[filterName]?.focus();
      }
    }, 0);
  };

  const filteredData = allocationData.filter((allocation) => {
    const expiryDate = allocation.expiry_date ? new Date(allocation.expiry_date) : null;
    const today = new Date();

    return (
      (allocation.username.toLowerCase().includes(filters.username.toLowerCase()) || !filters.username) &&
      (allocation.channel_id.toString().includes(filters.channelId) || !filters.channelId) &&
      (allocation.title.toLowerCase().includes(filters.title.toLowerCase()) || !filters.title) &&
      (allocation.network_id.toString().includes(filters.networkId) || !filters.networkId) &&
      (allocation.ip_address.toLowerCase().includes(filters.ipAddress.toLowerCase()) || !filters.ipAddress) &&
      (allocation.usecase?.toLowerCase().includes(filters.useCase.toLowerCase()) || !filters.useCase) &&
      (allocation.created_on?.includes(filters.createdDate) || !filters.createdDate) &&
      (!filters.expiryDate || (expiryDate && expiryDate.toLocaleDateString().includes(filters.expiryDate))) &&
      (!showExpired || (expiryDate && expiryDate < today)) // Filter for expired items
    );
  });

  const handleDeleteClick = (allocation) => {
    setUserToDelete(allocation);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch('http://10.20.52.99:4400/delete_ips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delete_data: [{
            username: userToDelete.username,
            ip_addresses: [userToDelete.ip_address],
          }],
        }),
      });

      if (!response.ok) throw new Error('Failed to delete IP');

      const result = await response.json();
      if (result.status) {
        setAllocation(prevAllocations => prevAllocations.filter(
          allocation => allocation.ip_address !== userToDelete.ip_address
        ));
        setUserToDelete(null);
        setDeleteDialogOpen(false);
        alert('IP deleted successfully');
      } else {
        console.error('Failed to delete IP:', result.not_deleted);
        alert('Failed to delete IP. Please try again.');
      }
    } catch (error) {
      alert('Error deleting IP: ' + error.message);
    }
    fetchAllocationData();
  };

  const handleShowExpiredChange = (e) => {
    setShowExpired(e.target.checked);
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">All Active IPs</h1>
        <button onClick={downloadCSV} className="admin-download-button">Download CSV</button>
        
        <FormControlLabel
          control={<Checkbox checked={showExpired} onChange={handleShowExpiredChange} />}
          label="Show Expired IPs"
          className="admin-filter-label"

        />

        <table className="allocation-table">
          <thead>
            <tr>
              {['username', 'channelId', 'title', 'networkId', 'ipAddress', 'useCase','createdDate', 'expiryDate'].map((key) => (
                <th key={key}>
                  <div className="header-container">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <FilterAltIcon
                      onClick={() => toggleFilterVisibility(key)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  {filterVisible[key] && (
                    <div className="filter-container">
                      <input
                        type="text"
                        name={key}
                        value={filters[key]}
                        onChange={handleFilterChange}
                        placeholder={`Filter ${key}`}
                        ref={(el) => (inputRefs.current[key] = el)}
                        className="filter-input"
                      />
                    </div>
                  )}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((allocation, index) => (
                <tr key={index}>
                  <td>{allocation.username}</td>
                  <td>{allocation.channel_id}</td>
                  <td>{allocation.title}</td>
                  <td>{allocation.network_id}</td>
                  <td>{allocation.ip_address}</td>
                  <td>{allocation.usecase}</td>
                  <td>{allocation.created_on}</td>
                  <td>{allocation.expiry_date ? new Date(allocation.expiry_date).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteClick(allocation)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data found</td>
              </tr>
            )}
          </tbody>
        </table>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} className="delete-dialog">
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete IP address {userToDelete?.ip_address} for user {userToDelete?.username}?
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

export default AdminPage;