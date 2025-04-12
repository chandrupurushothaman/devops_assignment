import React from 'react';
import './Documentation.css';

const Documentation = () => {
    return (
        <div className="documentation">
            <div className="ipm-card">
            <h1>DOCUMENTATION</h1>
            <p>
                The TAG Your IP Tool was developed by the I&T Automation Team in collaboration with the OTT Linear Team to address various challenges in allocating and requesting IPs for the BCN Z0 Network TAG Multiviewer MCM-9000. Previously, these tasks were handled manually using legacy tools. This application streamlines the process and resolves related issues. For a detailed explanation of the problem statements, refer to this <a href="https://wiki.at.sky/display/BIT/Phase+1%3A+Requirements+for+BCN+Network+Monitoring+Automation" target="_blank" rel="noopener noreferrer">link</a>.
            </p>
            <p>                Detailed Documentation can be found <a href="https://wiki.at.sky/display/BIT/TAG+YOUR+IP+-+User+Guide" target="_blank" rel="noopener noreferrer">here</a>.
            </p>

            <h2>Tech Stack Used:</h2>
            <ul>
                <li><strong>Backend</strong> - The backend API endpoints were built using Python and FastAPI.</li>
                <li><strong>Frontend</strong> - The frontend of the tool was built using ReactJS.</li>
            </ul>

            <h2>Landing Page:</h2>
            <h3>New Users:</h3>
            <ul>
                <li>Submit a registration request, which will be reviewed and processed by an admin.</li>
                <li>Access is granted only after admin approval.</li>
            </ul>

            <h3>Existing Users:</h3>
            <ul>
                <li>Log in using your credentials to access the application.</li>
                <li>Navigate across multiple pages based on your requirements.</li>
            </ul>

            <img src={require('./images/landing_page.png')} alt="Landing Page Screenshot" className="responsive-image" />

            <h2>Navigation Overview:</h2>
            <h3>For Admins:</h3>
            <p>
                Admins have access to all user functionalities along with additional features for administrative tasks. Below is a sample admin navigation pane.
            </p>
            <img src={require('./images/admin_navigation.png')} alt="Admin Navigation Pane" className="responsive-image" />

            <h3>For Users:</h3>
            <p>
                Users have access to specific functionalities tailored to their needs. The user navigation pane is simpler compared to the admin’s.
            </p>
            <img src={require('./images/user_navigation.png')} alt="User Navigation Pane" className="responsive-image" />

            <h2>Key Features and Pages:</h2>
            <h3>1. User IP Management:</h3>
            <p>
                This page allows admins to view all IPs requested and allocated via the tool.
            </p>
            <p><strong>Show Expired IPs:</strong> Filters and displays only the IPs that have passed their expiry date but are yet to be deallocated. Deleted IPs are excluded from this list.</p>
            <p><strong>Admin Actions:</strong> Admins can delete allocated IPs. Deleted IPs will be removed from TAG, marked as deleted in the tool, and archived.</p>
            <p><strong>Filtering:</strong> A filter bar is available to filter data based on specific queries across all table fields.</p>
            <img src={require('./images/manage_ip.png')} alt="User IP Management Page" className="responsive-image" />

            <h3>2. Manage Users:</h3>
            <p>
                Admins can manage the user database through this page:
            </p>
            <ul>
                <li>Search for users by their details.</li>
                <li>Edit user information such as name, department, role, or reset their password.</li>
                <li>Delete users from the system if necessary.</li>
            </ul>
            <img src={require('./images/manage_users.png')} alt="Manage Users Page" className="responsive-image" />

            <h3>3. Approval Requests:</h3>
            <p>
                When a new user submits a registration request, it appears on this page for admin review. Admins can either approve or reject these requests.
            </p>
            <img src={require('./images/approval_requests.png')} alt="Approval Requests Page" className="responsive-image" />

            <h3>4. Request Multicast IP:</h3>
            <p>
                Users can request IP allocation for BCN Z0 Red and BCN Z0 Blue networks.
            </p>
            <p><strong>Requesting Process:</strong></p>
            <ul>
                <li>Enter the quantity of IPs needed (up to 5 per network per request).</li>
                <li>Select the use case for the requested IPs to determine the allocation range.</li>
                <li>Submit the form to initiate a scan of the specified range.</li>
                <li>The tool scans each network separately (if applicable) and identifies available IPs.</li>
                <li>Provide a title and expiry date for each IP before saving.</li>
                <li>IPs will not be allocated until all required details are completed, and the <strong>Save</strong> button is clicked.</li>
            </ul>
            <img src={require('./images/request_multicast_ip.png')} alt="Request Multicast IP Page" className="responsive-image" />

            <h3>5. Manage IP:</h3>
            <p>
                Users can view and manage all active IPs they’ve requested.
            </p>
            <ul>
                <li>Extend the expiry date for allocated IPs.</li>
                <li>Delete IPs that are no longer needed or have expired.</li>
            </ul>
            <img src={require('./images/user_ip_management.png')} alt="Manage IP Page" className="responsive-image" />

        </div>
        </div>
    );
}

export default Documentation;
