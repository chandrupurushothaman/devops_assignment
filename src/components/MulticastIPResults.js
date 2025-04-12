import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import './MulticastIPResults.css';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';


const MulticastIPResults = ({ userDetail }) => {
  const location = useLocation(); // Hook to access navigation state
  const { state } = location || {};
  const [redIPs, setRedIPs] = useState(state?.redIPs?.free_ips || []);
  const [blueIPs, setBlueIPs] = useState(state?.blueIPs?.free_ips || []);
  const [redIPsStatus, setRedIPsStatus] = useState(state?.redIPs?.status || "");
  const [blueIPsStatus, setBlueIPsStatus] = useState(state?.blueIPs?.status || "");
  const [redNames, setRedNames] = useState({});
  const [blueNames, setBlueNames] = useState({});
  const [redUseCase, setRedUseCase] = useState("");
  const [blueUseCase, setBlueUseCase] = useState("");
  const [redExpiryDates, setRedExpiryDates] = useState({});
  const [blueExpiryDates, setBlueExpiryDates] = useState({});
  const [error, setError] = useState('');
  const username = userDetail?.name || 'User';
  const navigate = useNavigate(); 
  const [redError, setRedError] = useState('');
  const [blueError, setBlueError] = useState('');
  const [channeltitles, setChannelTitles] = useState('')

  const prefixToUseCaseMapping = {
    "239.10.0.": "Production incoming feeds",
    "239.10.1.": "VIPE",
    "239.10.2.": "Appear Gateway Ingress",
    "239.10.3.": "X20 IP Mux",
    "239.10.4.": "SDE",
    "239.10.5.": "IRD",
    "239.10.6.": "iMux/ACP",
    "239.10.7.": "Adsmart Istreamers",
    "239.10.8.": "SCTE Splicer",
    "239.10.9.": "Blackout Splicer",
    "239.10.10.": "SOIP Mezz Encoders",
    "239.10.11.": "DTH MKEL Encoders",
    "239.10.12.": "Analysers",
    "239.10.13.": "SDS",
    "239.10.14.": "MX8400/PROStream",
    "239.10.15.": "Modulators",
    "239.10.16.": "Appear Gateway EGRESS",
    "239.10.17.": "TBC",
    "239.10.18.": "TBC",
    "239.10.19.": "TBC",
    "239.10.20.": "TBC",
    "239.11.0.": "Production incoming feeds",
    "239.11.1.": "VIPE",
    "239.11.2.": "Appear Gateway Ingress",
    "239.11.3.": "X20 IP Mux",
    "239.11.4.": "SDE",
    "239.11.5.": "IRD",
    "239.11.6.": "iMux/ACP",
    "239.11.7.": "Adsmart Istreamers",
    "239.11.8.": "SCTE Splicer",
    "239.11.9.": "Blackout Splicer",
    "239.11.10.": "SOIP Mezz Encoders",
    "239.11.11.": "DTH MKEL Encoders",
    "239.11.12.": "Analysers",
    "239.11.13.": "SDS",
    "239.11.14.": "MX8400/PROStream",
    "239.11.15.": "Modulators",
    "239.11.16.": "Appear Gateway EGRESS",
    "239.11.17.": "TBC",
    "239.11.18.": "TBC",
    "239.11.19.": "TBC",
    "239.11.20.": "TBC",
    "239.199.9.": "Cross Site"
};

useEffect(() => {
  if (state) {
    if (typeof redIPs === 'string') {
      setRedError(redIPs);
      setRedIPs([]);
    } else if (Array.isArray(redIPs)) {
      setRedIPs(redIPs);
      // Set the use case for red IPs based on the first IP's prefix
      if (redIPs.length > 0) {
        const prefix = redIPs[0].split('.').slice(0, 3).join('.') + '.';
        setRedUseCase(prefixToUseCaseMapping[prefix] || "Unknown Use Case");
      }
    }

    if (typeof blueIPs === 'string') {
      setBlueError(blueIPs);
    } else if (Array.isArray(blueIPs)) {
      setBlueIPs(blueIPs);
      // Set the use case for blue IPs based on the first IP's prefix
      if (blueIPs.length > 0) {
        const prefix = blueIPs[0].split('.').slice(0, 3).join('.') + '.';
        setBlueUseCase(prefixToUseCaseMapping[prefix] || "Unknown Use Case");
      }
    }
  }

  const initialRedExpiryDates = {};
  redIPs.forEach(ip => {
    initialRedExpiryDates[ip] = null;
  });
  setRedExpiryDates(initialRedExpiryDates);

  const initialBlueExpiryDates = {};
  blueIPs.forEach(ip => {
    initialBlueExpiryDates[ip] = null;
  });
  setBlueExpiryDates(initialBlueExpiryDates);

  fetchChannelTitles();

}, [state, redIPs, blueIPs]);

const CustomDateInput = ({ value, onClick }) => (
  <div onClick={onClick} className="custom-date-input">
      {value ? value : "Expiry: None"} {/* Show N/A if no date is selected */}
  </div>
);

const fetchChannelTitles = async () => {
  try {
    const response = await fetch('http://10.20.52.99:4400/channel_titles');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setChannelTitles(data); // Assuming the response is a list
  } catch (error) {
    console.error('Error fetching channel titles:', error);
  }
};

  const handleSave = async () => {
    // Check if all IPs have names
    const allNamed = [...redIPs, ...blueIPs].every(
      (ip) =>
        (redNames[ip] && redNames[ip].trim()) ||
        (blueNames[ip] && blueNames[ip].trim())
    );

    if (!allNamed) {
      setError('Please provide names and use cases for all IP addresses.');
      return;
    }
    const allNames = [...Object.values(redNames), ...Object.values(blueNames)];
    const hasDuplicates = allNames.length !== new Set(allNames).size;

    if (hasDuplicates) {
        setError('Duplicate names are not allowed.');
        return;
    }    
    const invalidNames = allNames.filter(name =>
      channeltitles.some(title => title.toLowerCase() === name.toLowerCase())
    );
    if (invalidNames.length > 0) {
        setError(`The following names are invalid as they are already present : ${invalidNames.join(', ')}`);
        return;
    }

    try {
      // const response = await fetch('http://your-api-endpoint/save-ips', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     redIPs: redIPs.map((ip) => ({ ip, name: redNames[ip] })),
      //     blueIPs: blueIPs.map((ip) => ({ ip, name: blueNames[ip] })),
      //   }),
      // });
      const userDetail = JSON.parse(localStorage.getItem('userDetail'));
      const username = userDetail?.username;
      const requests = [
        ...redIPs.map((ip) => ({
          ip,
          title: redNames[ip],
          usecase: redUseCase,
          network_id: 13,
          username: username,
          date: redExpiryDates[ip] ? redExpiryDates[ip].toISOString() : null


        })),
        ...blueIPs.map((ip) => ({
          ip,
          title: blueNames[ip],
          usecase: blueUseCase,
          network_id: '14', 
          username: username,
          date: blueExpiryDates[ip] ? blueExpiryDates[ip].toISOString() : null
        })),
      ];
  
      // Make API calls in parallel
      const responses = await Promise.all(
        requests.map((req) =>
          fetch('http://10.20.52.99:4400/create_channel_config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
          })
        )
      );
  
      const results = await Promise.all(responses.map((res) => res.json()));
      const errors = results.filter((result) => result.errors);
  
      if (errors.length > 0) {
        const errorMessages = errors.map((err) => err.errors).join(', ');
        setError(`IPs failed to save: ${errorMessages}`);
      } else {
        alert('All IPs and names saved successfully!');
        navigate('/iprequest');
      }
    } catch (error) {
      console.error('Error saving IPs:', error);
      setError('Failed to save IPs and names. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/iprequest');
  };
  const handleRedExpiryChange = (ip, date) => {
    setRedExpiryDates(prev => ({ ...prev, [ip]: date }));
  };

  const handleBlueExpiryChange = (ip, date) => {
    setBlueExpiryDates(prev => ({ ...prev, [ip]: date }));
  };
  const handleNameChange = (color, ip, name) => {
    if (color === 'red') {
      setRedNames((prev) => ({ ...prev, [ip]: name }));
    } else {
      setBlueNames((prev) => ({ ...prev, [ip]: name }));
    }
  };

  const handleDeleteIP = (color, ip) => {
    if (color === 'red') {
      setRedIPs(prevIPs => prevIPs.filter(prevIP => prevIP !== ip));
    } else {
      setBlueIPs(prevIPs => prevIPs.filter(prevIP => prevIP !== ip));
    }
  };

  return (
    <div className="result-form-container">
      <div className="result-form-card">
        <h1 className="result-form-title">Multicast IP Request Results</h1>
        <p className="greeting">Hi {username}, here are your IP addresses:</p>
        <div className="results-sections-container">
          <div className="results-section">
            <h2 className="red-ip-title">Red IPs <br></br>({redUseCase})</h2>
            {redError ? (
              <div className="ip-error">
                <p className="error-message">{redError}</p>
              </div>
            ) : redIPs.length > 0 ? (
            <div className="ip-list">
              {redIPs.map((ip, index) => (
                <div key={index} className="ip-item">
                  <div>{ip}</div>
                  <input
                    type="text"
                    placeholder="Enter name for this IP"
                    value={redNames[ip] || ''}
                    onChange={(e) =>
                      handleNameChange('red', ip, e.target.value)
                    }
                    className="ip-name-input"
                  />
                    <DatePicker
                      selected={redExpiryDates[ip] || null}
                      customInput={<CustomDateInput />} // Use custom input

                      onChange={(date) => handleRedExpiryChange(ip, date)}
                      minDate={new Date()}
                      className="ip-datepicker"
                    />
                    <br></br>
                     <button
                      className="ip-delete-button"
                      onClick={() => handleDeleteIP('red', ip)}
                    >
                      Delete
                    </button>
                </div>
              ))}
              <p className="error-message">{redIPsStatus}</p>
            </div>
            ) : (
              <p>No Red IPs available</p>
            )}
          </div>

          <div className="results-section">
            <h2 className="blue-ip-title">Blue IPs <br></br>({blueUseCase})</h2>
            {blueError ? (
              <div className="ip-error">
                <p className="error-message">{blueError}</p>
              </div>
            ) : blueIPs.length > 0 ? (
            <div className="ip-list">
              {blueIPs.map((ip, index) => (
                <div key={index} className="ip-item">
                  <div>{ip}</div>
                  <input
                    type="text"
                    placeholder="Enter title for this IP"
                    value={blueNames[ip] || ''}
                    onChange={(e) =>
                      handleNameChange('blue', ip, e.target.value)
                    }
                    className="ip-name-input"
                  />
                    <DatePicker
                      selected={blueExpiryDates[ip] || null}
                      customInput={<CustomDateInput />}
                      onChange={(date) => handleBlueExpiryChange(ip, date)}
                      minDate={new Date()}
                      className="ip-datepicker"
                    />
                    <br></br>
                    <button
                      className="ip-delete-button"
                      onClick={() => handleDeleteIP('blue', ip)}
                    >
                      Delete
                    </button>
                </div>
              ))}
              <p className="error-message">{blueIPsStatus}</p>

            </div>
            ) : (
              <p>No Blue IPs available</p>
            )}
          </div>
          </div>
          <div>
          {error && <p className="error-message">{error}</p>}
          </div>
        {/* Save button - only show if there are IPs to save */}
        {(redIPs.length > 0 || blueIPs.length > 0) && (
          <div className="result-button-group">
            <button className="result-save-button" onClick={handleSave}>
              Save
            </button>
          <button className="result-cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default MulticastIPResults;
