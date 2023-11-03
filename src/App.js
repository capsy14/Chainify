// import logo from './logo.svg';
import React from 'react';
import { useEffect , useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { ethers } from 'ethers';
import './App.css';
import Navbar from './components/Navbar';
import abi from "./artifacts/contracts/Chainify.sol/Chainify.json"
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const address="0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [connected, setConnected] = useState(false);
  const [account,setAccount]=useState(null);
  const [contract,setContract]=useState(null);
  useEffect(() => {
    const connectToBlockchain = async () => {
      try {
        const { ethereum } = window;
        let provider;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const account = accounts[0];
          setAccount(account);
          setConnected(true);
          provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          console.log(contractAddress + " hello");
          const contractABI = abi.abi;

          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setContract(contract);
          const items = [];
          for(var i=0;i<9;i++){
            const item= await  contract.items(i+1);
            items.push(item);
          }
          console.log(items);

          setState({ provider, signer, contract });
        } else {
          alert("Please install MetaMask to use this app.");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    connectToBlockchain();
  }, []);

  const requestAccount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const account = accounts[0];
        setAccount(account);
      } else {
        alert("Please install MetaMask to use this app.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const success = () => {
    toast.success(`Connected Account: ${account} `, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar account={account} setAccount={setAccount}/>
        {connected ? (
          <>
            {" "}
            {/* <button onClick={success}>Connected to Metamask</button>
            <ToastContainer className="mt-14" /> */}
          </>
        ) : (
          <button onClick={requestAccount}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
};

export default App;