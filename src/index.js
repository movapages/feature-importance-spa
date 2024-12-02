import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import '../public/css/logo.css';
import '../public/css/page.css';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(<App />); // Render the App component
