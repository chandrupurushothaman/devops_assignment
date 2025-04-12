import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './IPManager.css';
import { useNavigate } from 'react-router-dom';

const IPManager = ({ currentUser }) => {
  const [currentIPs, setCurrentIPs] = useState([]);
  const [selectedIPsToDelete, setSelectedIPsToDelete] = useState([]);
  const [extendDates, setExtendDates] = useState({});
  const [userDetail, setUserDetail] = useState(currentUser );
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [filters, setFilters] = useState({
    ipAddress: '',
    title: '',
    useCase: '',
    expiryDate: ''
  });
  const [filterVisible, setFilterVisible] = useState({
    ipAddress: false,
    title: false,
    useCase: false,
    expiryDate: false
  });
  const inputRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await fetch('http://10.20.52.99:4400/allocations');
        const data = await response.json();
        const filteredIPs = data.filter(ip => ip.username === currentUser.username);
        setCurrentIPs(filteredIPs);
      } catch (error) {
        console.error('Error fetching allocations:', error);
      }
    };

    fetchAllocations();
  }, [currentUser]);

  const toggleFilterVisibility = (filterName) => {
    setFilterVisible(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));

    setTimeout(() => {
      if (!filterVisible[filterName]) {
        inputRefs.current[filterName]?.focus();
      }
    }, 0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  const handleSelectForDelete = (ipAddress) => {
    setSelectedIPsToDelete(prev =>
      prev.includes(ipAddress) ? prev.filter(ip => ip !== ipAddress) : [...prev, ipAddress]
    );
  };

  const handleExtendChange = (ipAddress, date) => {
    setExtendDates(prev => ({
      ...prev,
      [ipAddress]: date
    }));
  };

  const handleSave = async () => {
    // Handle expiry date extension
    const extendRequests = Object.entries(extendDates).map(([ipAddress, date]) => ({
      ip_address: ipAddress,
      username: userDetail.username,
      date: date.toISOString(),
    }));

    if (extendRequests.length > 0) {
      const response = await fetch('http://10.20.52.99:4400/extend_allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extend_data: extendRequests,
        }),
      });

      const result = await response.json();
      if (result.status) {
        const updatedIPs = currentIPs.map(ip => ({
          ...ip,
          expiry_date: extendDates[ip.ip_address] || ip.expiry_date,
        }));
        setCurrentIPs(updatedIPs);
        setExtendDates({});
      } else {
        console.error('Failed to extend IPs:', result.not_updated);
      }
    }
  };


  const handleDelete = async() => {
        // Handle deletion
        if (selectedIPsToDelete.length > 0) {
          const response = await fetch('http://10.20.52.99:4400/delete_ips', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              delete_data: [{
                username: userDetail.username,
                ip_addresses: selectedIPsToDelete,
              }],
            }),
          });
    
          const result = await response.json();
          if (result.status) {
            setCurrentIPs(prev => prev.filter(ip => !selectedIPsToDelete.includes(ip.ip_address)));
            setSelectedIPsToDelete([]);
          } else {
            console.error('Failed to delete IPs:', result.not_deleted);
          }
        }
  };

  const handleSaveTitle = async (ipAddress, title) => {
    try {
      const response = await fetch('http://10.20.52.99:4400/update_title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ipAddress,
          username: userDetail.username,
          title: title,
        }),
      });

      const result = await response.json();
      if (result.status) {
        alert('Title updated successfully!');
      } else {
        alert('Failed to update title:', result.error);
      }
    } catch (error) {
      alert('Error updating title:', error);
    }
    window.location.reload();
  };

  const filteredIPs = currentIPs.filter(ip => {
    const expiryDate = ip.expiry_date ? String(ip.expiry_date).toLowerCase() : ''; 
    return (
      (ip.ip_address.includes(filters.ipAddress) || !filters.ipAddress) &&
      (ip.title?.toLowerCase().includes(filters.title.toLowerCase()) || !filters.title) &&
      (ip.usecase?.toLowerCase().includes(filters.useCase.toLowerCase()) || !filters.useCase) &&
      (ip.created_on?.includes(filters.createdDate) || !filters.createdDate) &&
      (!filters.expiryDate || 
        expiryDate.includes(filters.expiryDate.toLowerCase()) || 
        (filters.expiryDate.toLowerCase() === 'no expiry' && !ip.expiry_date)
      )
    );
  });

  return (
    <div className="ipm-container">
      <div className="ipm-card">
        <h1 className="ipm-title">My IPs</h1>
        <table className="ipm-table">
          <thead>
            <tr className="ipm-header-row">
              {['ipAddress', 'title', 'useCase','createdDate', 'expiryDate'].map((key) => (
                <th key={key} className="ipm-header-item">
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
              <th className="ipm-header-item">Extend</th>
            </tr>
          </thead>
          <tbody>
            {filteredIPs.map((ipData, index) => (
              <tr className={`ipm-row ${ipData.network_id === 13 ? 'red' : 'blue'}`} key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIPsToDelete.includes(ipData.ip_address)}
                    onChange={() => handleSelectForDelete(ipData.ip_address)}
                  />
                </td>
                <td className="ipm-ip-item">{ipData.ip_address}</td>
                <td className="ipm-title-item">
                  {editingTitle === ipData.ip_address ? (
                    <div className="title-edit-container">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <div>
                        <button className="save-button" onClick={() => handleSaveTitle(ipData.ip_address, newTitle)}>Save</button>
                        <button className="cancel-button" onClick={() => setEditingTitle(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>{ipData.title}</span>
                      <button className="title-edit-button" onClick={() => {
                        setEditingTitle(ipData.ip_address);
                        setNewTitle(ipData.title);
                      }}>
                        <EditIcon />
                      </button>
                    </>
                  )}
                </td>
                <td className="ipm-ip-item">{ipData.usecase}</td>
                <td className="ipm-ip-item">{ipData.created_on}</td>
                <td className="ipm-expiry-item">{ipData.expiry_date ? new Date(ipData.expiry_date).toLocaleDateString('en-GB') : 'No expiry'}</td>
                <td>
                  <DatePicker
                    selected={extendDates[ipData.ip_address] || null}
                    onChange={(date) => handleExtendChange(ipData.ip_address, date)}
                    className="ipm-datepicker"
                    placeholderText="Select new expiry date"
                    minDate={new Date()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ipm-button-group">
          <button className="ipm-submit-button" onClick={handleSave}>Submit</button>
          <button className="ipm-cancel-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default IPManager;
