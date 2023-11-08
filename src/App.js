import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'


import Navbar from './components/Navbar'


import ChainifyAbi from './abis/Chainify.json'


function App() {
  const [provider, setProvider] = useState(null)
  const [chainify, setchainify] = useState(null)

  const [account, setAccount] = useState(null)

  

  const [item, setItem] = useState({})



  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()

    const chainify = new ethers.Contract("0x843D3a797BbA9E204Ad1Bb2f7cA7f1B788F2e6D3", ChainifyAbi, provider)
    setchainify(chainify)

    const items = []

    for (var i = 0; i < 28; i++) {
      const item = await chainify.items(i + 1)
      items.push(item)
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navbar account={account} setAccount={setAccount} />


     
    </div>
  );
}

export default App;
