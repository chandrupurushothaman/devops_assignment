import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MulticastIPRequestForm.css';

const MulticastIPRequestForm = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanError, setScanError] = useState('');
    const [scanId, setScanId] = useState(null);
    const isCancelledRef = useRef(false); 
    const [formData, setFormData] = useState({
        redQuantity: '',
        blueQuantity: '',
        redStartPrefix: '',
        redStartLastOctet: '',
        redEndLastOctet: '',
        blueStartPrefix: '',
        blueStartLastOctet: '',
        blueEndLastOctet: ''
    });
    const [errors, setErrors] = useState({});

    const redPrefixes = [
        { description: "Production incoming feeds (.0.)", prefix: "239.10.0." },
        { description: "VIPE (.1.)", prefix: "239.10.1." },
        { description: "Appear Gateway Ingress (.2.)", prefix: "239.10.2." },
        { description: "X20 IP Mux (.3.)", prefix: "239.10.3." },
        { description: "SDE (.4.)", prefix: "239.10.4." },
        { description: "IRD (.5.)", prefix: "239.10.5." },
        { description: "iMux/ACP (.6.)", prefix: "239.10.6." },
        { description: "Adsmart Istreamers (.7.)", prefix: "239.10.7." },
        { description: "SCTE Splicer (.8.)", prefix: "239.10.8." },
        { description: "Blackout Splicer (.9.)", prefix: "239.10.9." },
        { description: "SOIP Mezz Encoders (.10.)", prefix: "239.10.10." },
        { description: "DTH MKEL Encoders (.11.)", prefix: "239.10.11." },
        { description: "Analysers (.12.)", prefix: "239.10.12." },
        { description: "SDS (.13.)", prefix: "239.10.13." },
        { description: "MX8400/PROStream (.14.)", prefix: "239.10.14." },
        { description: "Modulators (.15.)", prefix: "239.10.15." },
        { description: "Appear Gateway EGRESS (.16.)", prefix: "239.10.16." },
        { description: "Cross Site (.199.9.)", prefix: "239.199.9." },
        { description: "TBC1 (.17.)", prefix: "239.10.17." },
        { description: "TBC2 (.18.)", prefix: "239.10.18." },
        { description: "TBC3 (.19.)", prefix: "239.10.19." },
        { description: "TBC4 (.20.)", prefix: "239.10.20." },
    ];

    const bluePrefixes = [
        { description: "Production incoming feeds", prefix: "239.11.0." },
        { description: "VIPE", prefix: "239.11.1." },
        { description: "Appear Gateway Ingress", prefix: "239.11.2." },
        { description: "X20 IP Mux", prefix: "239.11.3." },
        { description: "SDE", prefix: "239.11.4." },
        { description: "IRD", prefix: "239.11.5." },
        { description: "iMux/ACP", prefix: "239.11.6." },
        { description: "Adsmart Istreamers", prefix: "239.11.7." },
        { description: "SCTE Splicer", prefix: "239.11.8." },
        { description: "Blackout Splicer", prefix: "239.11.9." },
        { description: "SOIP Mezz Encoders", prefix: "239.11.10." },
        { description: "DTH MKEL Encoders", prefix: "239.11.11." },
        { description: "Analysers", prefix: "239.11.12." },
        { description: "SDS", prefix: "239.11.13." },
        { description: "MX8400/PROStream", prefix: "239.11.14." },
        { description: "Modulators", prefix: "239.11.15." },
        { description: "Appear Gateway EGRESS", prefix: "239.11.16." },
        { description: "Cross Site (.199.9.)", prefix: "239.199.9." },
        { description: "TBC1", prefix: "239.11.17." },
        { description: "TBC2", prefix: "239.11.18." },
        { description: "TBC3", prefix: "239.11.19." },
        { description: "TBC4", prefix: "239.11.20." },
    ];

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const validateLastOctet = (value) => {
        if (value === '') return false;
    
        const num = parseInt(value, 10);
    
        if (isNaN(num)) return false;
    
        return num >= 1 && num <= 254;
    };

    const validateForm = () => {
        const newErrors = {};
    
        // Validate prefixes and last octets for red
        if (parseInt(formData.redQuantity) > 0) {
            // Validate red prefix
            if (!formData.redStartPrefix) {
                newErrors.redStartPrefix = 'Red start prefix is required';
            }
    
            // Validate red start last octet
            if (!validateLastOctet(formData.redStartLastOctet)) {
                newErrors.redStartLastOctet = 'Red start last octet must be between 1 and 254';
            }
    
            // Validate red end last octet
            if (!validateLastOctet(formData.redEndLastOctet)) {
                newErrors.redEndLastOctet = 'Red end last octet must be between 1 and 254';
            }
    
            // Additional check to ensure start octet is less than or equal to end octet
            const startOctet = parseInt(formData.redStartLastOctet);
            const endOctet = parseInt(formData.redEndLastOctet);
            if (validateLastOctet(formData.redStartLastOctet) && 
                validateLastOctet(formData.redEndLastOctet) && 
                startOctet > endOctet) {
                newErrors.redEndLastOctet = 'End octet must be greater than or equal to start octet';
            }
        }
    
        // Validate prefixes and last octets for blue
        if (parseInt(formData.blueQuantity) > 0) {
            // Validate blue prefix
            if (!formData.blueStartPrefix) {
                newErrors.blueStartPrefix = 'Blue start prefix is required';
            }
    
            // Validate blue start last octet
            if (!validateLastOctet(formData.blueStartLastOctet)) {
                newErrors.blueStartLastOctet = 'Blue start last octet must be between 1 and 254';
            }
    
            // Validate blue end last octet
            if (!validateLastOctet(formData.blueEndLastOctet)) {
                newErrors.blueEndLastOctet = 'Blue end last octet must be between 1 and 254';
            }
    
            // Additional check to ensure start octet is less than or equal to end octet
            const startOctet = parseInt(formData.blueStartLastOctet);
            const endOctet = parseInt(formData.blueEndLastOctet);
            if (validateLastOctet(formData.blueStartLastOctet) && 
                validateLastOctet(formData.blueEndLastOctet) && 
                startOctet > endOctet) {
                newErrors.blueEndLastOctet = 'End octet must be greater than or equal to start octet';
            }
        }
                setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

    const initiateScan = async (scanId) => {
        setScanId(scanId);
        setIsScanning(true);
        setScanProgress(0);
        setScanError('');
        isCancelledRef.current = false;

        const maxDuration = 900000;
        const startTime = Date.now();

        try {
            const startScanResponse = await fetch(`http://10.20.52.99:4400/scan/${scanId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!startScanResponse.ok) {
                throw new Error('Failed to start scan');
            }
            await sleep(3000);
            return await new Promise((resolve, reject) => {
                const checkScanStatus = async () => {
                    if (isCancelledRef.current) {
                        console.log("Scan canceled. Stopping status checks.");
                        return;
                    }
                    try {
                        const statusResponse = await fetch(`http://10.20.52.99:4400/check_scan/${scanId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!statusResponse.ok) {
                            throw new Error('Failed to check scan status');
                        }

                        const statusData = await statusResponse.json();

                        if (statusData.status) {
                            setIsScanning(false);
                            setScanProgress(100);
                            if (statusData.failed) {
                                setScanError('Scan failed please validate in tag.');
                                reject(new Error('Scan failed'));
                            } else {
                                resolve(statusData);
                            }
                        } else {
                            setScanProgress(statusData.progress || 0);
                            if (Date.now() - startTime > maxDuration) {
                                setIsScanning(false);
                                reject(new Error('Scan status check timed out'));
                            }
                            else {
                                setTimeout(checkScanStatus, 5000);
                            }
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                checkScanStatus();
            });
        } catch (error) {
            console.error('Error during scan:', error);
            setIsScanning(false);
            setScanError('Failed to start or complete scan');
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.redStartPrefix === "239.199.9." && formData.blueStartPrefix === "239.199.9.") { 
            const redStart = parseInt(formData.redStartLastOctet);
            const redEnd = parseInt(formData.redEndLastOctet);
            const blueStart = parseInt(formData.blueStartLastOctet);
            const blueEnd = parseInt(formData.blueEndLastOctet);
        
            if ((redStart <= blueEnd && redEnd >= blueStart)) {
                setErrors({ ...errors, redEndLastOctet: 'Red and blue IP ranges cannot overlap.' });
                return;
            }
        }

        if (!validateForm()) {
            return;
        }
        setIsSubmitted(true);

        try {
            if (formData.redQuantity > 0){
                const redRequestBody = {
                    start_ip: `${formData.redStartPrefix}${formData.redStartLastOctet}`,
                    end_ip: `${formData.redStartPrefix}${formData.redEndLastOctet}`,
                    network_id: '13'
                };
                const redScanResponse = await fetch('http://10.20.52.99:4400/create_scan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(redRequestBody)
                    });

                if (!redScanResponse.ok) {
                    throw new Error('Failed to create red scan');
                }

                const redScanData = await redScanResponse.json();
                const redScanId = redScanData['scan_id'];

                // Initiate scan for red
                await initiateScan(redScanId);

                const deleteRedScanresponse = await fetch(`http://10.20.52.99:4400/delete_scan/${redScanId}`, {
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                }

                                            });

                if (!deleteRedScanresponse.ok) {
                    throw new Error('Failed to delete red scan');
                }
            }
            
            
            if (formData.blueQuantity > 0){
                const blueRequestBody = {
                    start_ip: `${formData.blueStartPrefix}${formData.blueStartLastOctet}`,
                    end_ip: `${formData.blueStartPrefix}${formData.blueEndLastOctet}`,
                    network_id: '14'
                };

                

                // Call create_scan API for blue
                const blueScanResponse = await fetch('http://10.20.52.99:4400/create_scan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(blueRequestBody)
                });

                if (!blueScanResponse.ok) {
                    throw new Error('Failed to create blue scan');
                }

                const blueScanData = await blueScanResponse.json();
                const blueScanId = blueScanData['scan_id'];

                // Initiate scan for blue
                await initiateScan(blueScanId);

                const deleteBlueScanresponse = await fetch(`http://10.20.52.99:4400/delete_scan/${blueScanId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!deleteBlueScanresponse.ok) {
                    throw new Error('Failed to delete blue scan');
                }
            }

            // Prepare the request body for multicast IP request
            const requestBody = {
                ...(parseInt(formData.redQuantity) > 0 ? {
                red_start: `${formData.redStartPrefix}${formData.redStartLastOctet}`,
                red_end: `${formData.redStartPrefix}${formData.redEndLastOctet}`,
                red_count: parseInt(formData.redQuantity)
                } : {}),
                ...(parseInt(formData.blueQuantity) > 0 ? {
                    blue_start: `${formData.blueStartPrefix}${formData.blueStartLastOctet}`,
                    blue_end: `${formData.blueStartPrefix}${formData.blueEndLastOctet}`,
                    blue_count: parseInt(formData.blueQuantity)
                } : {})
            };
            console.log(requestBody)    

            // Send multicast IP request
            const response = await fetch('http://10.20.52.99:4400/free_ips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to send data to API');
            }

            const data = await response.json();
            console.log('Response from API:', data);

            navigate('/results', { 
                state: { 
                    redIPs: data.redIPs || [], 
                    blueIPs: data.blueIPs || [] 
                } 
            });

        } catch (error) {
            console.error('Error during submission:', error);
            if (error.message === 'Scan status check timed out') {
                setScanError('The scan took too long to complete. Please try again with a different range.');
            } else {
                setScanError('Failed to complete request. Please try again.');
            }
            setIsSubmitted(false);

        }
    };
        // Handle description selection for red prefix
    const handleRedDescriptionChange = (event) => {
        const selectedDescription = event.target.value;
        const selectedPrefix = redPrefixes.find(prefix => prefix.description === selectedDescription)?.prefix || '';
        setFormData({ ...formData, redStartPrefix: selectedPrefix });
    };

    // Handle description selection for blue prefix
    const handleBlueDescriptionChange = (event) => {
        const selectedDescription = event.target.value;
        const selectedPrefix = bluePrefixes.find(prefix => prefix.description === selectedDescription)?.prefix || '';
        setFormData({ ...formData, blueStartPrefix: selectedPrefix });
    };
    const handleCancel = async () => {
        setIsScanning(false);
        setIsSubmitted(false)
        isCancelledRef.current = true;
        if (scanId) {
            try {
                const deleteScanResponse = await fetch(`http://10.20.52.99:4400/delete_scan/${scanId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!deleteScanResponse.ok) {
                    throw new Error('Failed to delete scan');
                }
                console.log('Scan deleted successfully');
            } catch (error) {
                console.error('Error deleting scan:', error);
                setScanError('Failed to delete scan');
            }
        }
    };
    

    return (
        <div className="form-container">
            <div className="request-form-card">
                <h1 className="form-title">Request Multicast IP</h1>
                <form onSubmit={handleSubmit}>
                    {/* Your existing form inputs remain the same */}
                    <div className="form-section">
                        {/* Red Quantity and IP Range inputs */}
                        <div className="request-input-group">
                            <label>Red Quantity:</label>
                            <select
                                name="redQuantity"
                                value={formData.redQuantity}
                                onChange={(e) => setFormData({ ...formData, redQuantity: e.target.value })}
                                className={`input ${isSubmitted ? 'disabled-input' : ''}`}
                                disabled={isSubmitted}
                            >
                                {[...Array(6)].map((_, index) => (
                                    <option key={index} value={index}>{index}</option>
                                ))}
                            </select>
                            {errors.redQuantity && <p
                            className="error-message">{errors.redQuantity}</p>}
                        </div>

                        {formData.redQuantity > 0 && (
                            <div className="request-input-group">
                                <label>Red IP Range:</label>
                                <div className="ip-range-container">
                                    <div className="ip-input-group">
                                    <select id="redDescription" 
                                    className="prefix-select"
                                    disabled={isSubmitted}
                                    onChange={handleRedDescriptionChange}>
                                    <option value="">--Select--</option>
                                            {redPrefixes.map((item, index) => (
                                                <option key={index} value={item.description}>{item.description}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            name="redStartLastOctet"
                                            min="1"
                                            max="254"
                                            value={formData.redStartLastOctet}
                                            onChange={(e) => {
                                                // Limit input to 3 digits
                                                const value = e.target.value.slice(0, 3);
                                                setFormData({ ...formData, redStartLastOctet: value });
                                            }}                                            
                                            className={`octet-input ${errors.redStartLastOctet ? 'error' : ''} ${isSubmitted ? 'disabled-input' : ''}`}
                                            placeholder="1-254"
                                            disabled={isSubmitted}

                                        />
                                    </div>
                                    <span>to</span>
                                    <div className="ip-input-group">
                                        <input
                                            type="number"
                                            name="redEndLastOctet"
                                            min="1"
                                            max="254"
                                            value={formData.redEndLastOctet}
                                            onChange={(e) => {
                                                // Limit input to 3 digits
                                                const value = e.target.value.slice(0, 3);
                                                setFormData({ ...formData, redEndLastOctet: value });
                                            }}                                            
                                            className={`octet-input ${errors.redEndLastOctet ? 'error' : ''} ${isSubmitted ? 'disabled-input' : ''}`}
                                            placeholder="1-254"
                                            disabled={isSubmitted}
                                        />
                                    </div>
                                </div>
                                {errors.redStartPrefix && <p className="error-message">{errors.redStartPrefix}</p>}
                                {errors.redStartLastOctet && <p className="error-message">{errors.redStartLastOctet}</p>}
                                {errors.redEndLastOctet && <p className="error-message">{errors.redEndLastOctet}</p>}
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        {/* Blue Quantity and IP Range inputs */}
                        <div className="request-input-group">
                            <label>Blue Quantity:</label>
                            <select
                                name="blueQuantity"
                                value={formData.blueQuantity}
                                onChange={(e) => setFormData({ ...formData, blueQuantity: e.target.value })}
                                className={`input ${isSubmitted ? 'disabled-input' : ''}`}
                                disabled={isSubmitted}

                            >
                                {[...Array(6)].map((_, index) => (
                                    <option key={index} value={index}>{index}</option>
                                ))}
                            </select>
                            {errors.blueQuantity && <p className="error-message">{errors.blueQuantity}</p>}
                        </div>

                        {formData.blueQuantity > 0 && (
                            <div className="request-input-group">
                                <label>Blue IP Range:</label>
                                <div className="ip-range-container">
                                    <div className="ip-input-group">
                                    <select id="blueDescription" className="prefix-select" disabled={isSubmitted} onChange={handleBlueDescriptionChange}>
                                        <option value="">--Select--</option>
                                        {bluePrefixes.map((item, index) => (
                                            <option key={index} value={item.description}>{item.description}</option>
                                        ))}
                                    </select>
                                        <input
                                            type="number"
                                            name="blueStartLastOctet"
                                            min="1"
                                            max="254"
                                            value={formData.blueStartLastOctet}
                                            onChange={(e) => {

                                                const value = e.target.value.slice(0, 3);
                                                setFormData({ ...formData, blueStartLastOctet: value });
                                            }}                                           
                                            className={`octet-input ${errors.blueStartLastOctet ? 'error' : ''} ${isSubmitted ? 'disabled-input' : ''}`}
                                            placeholder="1-254"
                                            disabled={isSubmitted}

                                        />
                                    </div>
                                    <span>to</span>
                                    <div className="ip-input-group">
                                        <input
                                            type="number"
                                            name="blueEndLastOctet"
                                            min="1"
                                            max="254"
                                            value={formData.blueEndLastOctet}
                                            onChange={(e) => {
                                                // Limit input to 3 digits
                                                const value = e.target.value.slice(0, 3);
                                                setFormData({ ...formData, blueEndLastOctet: value });
                                            }}                                         
                                            className={`octet-input ${errors.blueEndLastOctet ? 'error' : ''} ${isSubmitted ? 'disabled-input' : ''}`}
                                            placeholder="1-254"
                                            disabled={isSubmitted}

                                        />
                                    </div>
                                </div>
                                {errors.blueStartPrefix && <p className="error-message">{errors.blueStartPrefix}</p>}
                                {errors.blueStartLastOctet && <p className="error-message">{errors.blueStartLastOctet}</p>}
                                {errors.blueEndLastOctet && <p className="error-message">{errors.blueEndLastOctet}</p>}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-button" disabled={isSubmitted}>
                        {isSubmitted ? 'Please Wait' : 'Submit'}
                    </button>
                    {scanError && <p className="error-message">{scanError}</p>}
                    {isScanning && (
                        <div className="scan-container">
                            <div className="progress-container">
                                <div 
                                    className={`progress-bar ${isScanning ? 'scanning' : ''}`} 
                                    style={{ width: `${scanProgress}%` }}
                                >
                                    <span className="progress-percentage">{scanProgress}%</span>
                                </div>
                            </div>
                            <div className="scan-status-message">
                                {scanProgress < 100 
                                    ? "Scanning available IP addresses..." 
                                    : "Scan completed successfully"}
                            </div>
                            <button type="button" className="cancel-button" onClick={handleCancel} disabled={!isScanning}>
                             Cancel
                             </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MulticastIPRequestForm;
