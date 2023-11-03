import React from 'react';
import '../styles/navbar.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { ethers } from 'ethers';

const Navbar = ({ account, setAccount }) => {
  const connectMetamask = async () => {
    console.log('connecting...');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };

  const success = () => {
    toast.success(`Connected Account: ${account} `, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  return (
      <div className="navbar">
      <div className="Logo-name">
        <h1 className='logoname'>Chainify</h1>
        </div>

      {account ? (
          <h2>
          {account.slice(0, 6) + '...' + account.slice(38, 42)}<br/>
          <button onClick={success}>Connected to Metamask</button>
          <ToastContainer className="mt-14" />
        </h2>
      ) : (
          <button type="button" className="meta_connect" onClick={connectMetamask}>
          Connect
        </button>
      )}
    </div>
  );
};

export default Navbar;
