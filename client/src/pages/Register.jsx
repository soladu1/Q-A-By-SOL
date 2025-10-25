import React, { useRef } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  const userNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('/users/register', {
  username: userNameDom.current.value,
  firstname: firstNameDom.current.value,
  lastname: lastNameDom.current.value,
  email: emailDom.current.value,
  password: passwordDom.current.value
});

      console.log('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  return (
    <div style={styles.container}>
      {/* Main Content Section */}
      <div style={styles.mainContent}>
        <h1 style={styles.mainTitle}>Join the network</h1>

        <form style={styles.formSection} onSubmit={handleSubmit}>
          <h2 style={styles.sectionTitle}>User Name</h2>
          <input
            ref={userNameDom}
            type="text"
            placeholder="User Name"
            style={styles.fullWidthInput}
            required
          />

          <div style={styles.nameRow}>
            <input
              ref={firstNameDom}
              type="text"
              placeholder="First Name"
              style={styles.input}
              required
            />
            <input
              ref={lastNameDom}
              type="text"
              placeholder="Last Name"
              style={styles.input}
              required
            />
          </div>

          <h2 style={styles.sectionTitle}>Email</h2>
          <input
            ref={emailDom}
            type="email"
            placeholder="Email"
            style={styles.fullWidthInput}
            required
          />

          <h2 style={styles.sectionTitle}>Password</h2>
          <input
            ref={passwordDom}
            type="password"
            placeholder="Password"
            style={styles.fullWidthInput}
            required
          />

          <button type="submit" style={styles.joinButton}>
            Agree and Join
          </button>

          <p style={styles.loginPrompt}>
            Already have an account?{' '}
            <span style={styles.loginLink} onClick={handleLoginRedirect}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',   // center horizontally
    alignItems: 'center',       // center vertically
    height: '90vh',             // 90% of browser height
    width: '100vw',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7faff',
    margin: 0,
    padding: 0,
    overflow: 'hidden',         // prevent scrollbars
  },
  mainContent: {
    width: '400px',
    border: '2px solid #0073b1',
    borderRadius: '5px',
    padding: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#0073b1',
    textAlign: 'center',
  },
  loginPrompt: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    textAlign: 'center',
  },
  loginLink: {
    color: '#0073b1',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '15px 0 8px 0',
    color: '#333',
  },
  nameRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  fullWidthInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '10px',
  },
  joinButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0073b1',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    marginBottom: '10px',
  },
  termsSection: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  termsText: {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.4',
  },
};

export default SignUpPage;
