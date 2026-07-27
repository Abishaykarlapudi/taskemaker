import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TaskMaker App Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0b0f19', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#f43f5e', fontSize: '1.5rem', marginBottom: '12px' }}>⚠️ Application Error Detected</h1>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            An unexpected error occurred. Here are the details:
          </p>
          <pre style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', color: '#f472b6', overflowX: 'auto', fontSize: '0.88rem' }}>
            {this.state.error && this.state.error.toString()}
            {'\n'}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reset Storage & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
