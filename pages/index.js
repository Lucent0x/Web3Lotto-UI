import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import lotteryContract from '../blockchain/lottery'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'

export default function Home() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [lcContract, setLcContract] = useState()
  const [lotteryPot, setLotteryPot] = useState()
  const [lotteryPlayers, setPlayers] = useState([])
  const [lotteryHistory, setLotteryHistory] = useState([])
  const [lotteryId, setLotteryId] = useState()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [buttonStatus, setButtonStatus] = useState('')
  
  useEffect(() => {
    updateState()
    showAddress()
  }, [lcContract, showAddress, updateState])

  
  const updateState =  () => {
    if(lcContract) getPot()
    if(lcContract) getPlayers()
    if(lcContract) getLotteryId()
  }
  const getPot = async () =>{
    console.log('get pot')
    const players = await lcContract.methods.getPlayers().call()
    setPlayers(players)
  }
  
  const getPlayers = async () =>{
    const pot = await lcContract.methods.getBalance().call()
    setLotteryPot(web3.utils.fromWei(pot))
  }

  const getHistory = async (id) => {
    for (let i = parseInt(id); i > 0; i--){
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call()
      const historyObj = { }
      historyObj.id = i
       historyObj.address = winnerAddress
      setLotteryHistory(lotteryHistory => [...lotteryHistory, historyObj])
    }

  }
    const getLotteryId = async ( ) => {
      const lotteryId = await lcContract.methods.lotteryId().call()
      setLotteryId(lotteryId);
      await getHistory(lotteryId)
  }
  const enterLotteryHandler = async () =>{
    setError('')
  try {
     await lcContract.methods.enter().send({
      from: address,
      value: '15000000000000000',
      gas: 300000,
      gasPrice: null
    })
    updateState()
  } catch (error) {
    setError(error.message)
  }
  }

  const pickWinnerHandler = async  ( ) => {
    setError('')
    try {
      await lcContract.methods.payWinner().send({
         from: address,
         gas: 300000,
         gasPrice: null
      })
      const winnerAddress = await lcContract.methods.lotteryHistory(lotteryId).call()
      setSuccess(`And the winner is ${winnerAddress} `)
      updateState()
    } catch (error) {
      
    }
  }
  const connectWalletHandler = async ( ) =>{
    setError('')
    // check if metamask is installed.
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
      try {
        //request wallet connection
        await window.ethereum.request({ method: 'eth_requestAccounts'})
        // create web3 instance & set as state var
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        // get list of account & set account
        const accounts = await web3.eth.getAccounts()
        setAddress(accounts[0])
        console.log(address)
        //step2
        // create local contract copy
        const lc = lotteryContract(web3)
        setLcContract(lc)

    window.ethereum.on('accountsChanged', async () => {
    const accounts = await web3.eth.getAccounts()
    //reset the account
    setAddress(accounts[0])  
  })
      } catch (error) {
        setError(error.message)
      } 
    }else{
      setError("please install metamask. ")
    }
  }
  const showAddress = async ( ) => {
    if ( address ){
      setButtonStatus(address.substring(0,10)+"....") 
    }else{
      setButtonStatus("connect wallet") 
    }
  }

   return (
    <div>
      <Head>
        <title>Matic lotto dApp</title>
        <meta name="description" content="A simple polygon matic dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className="navbar mt-4 mb-4">
          <div className='container'>
            <div className='navbar-brand '>
              <h1> Matic Lottery </h1>
            </div>
            <div className='navbar-end'>
              <button className='button is-link' onClick={connectWalletHandler}> {buttonStatus} </button>
            </div>
          </div>
        </nav>
        <div className='container'>
          <section className='mt-5' >
            <div className='columns'>
            <div className='column is-two-third'>
                 <section className='mt-5'>
                  <p>Enter lottery by sending 0.15 $Matic</p>
                  <button className='button is-link is-large mt-3' onClick={enterLotteryHandler}>Join in </button>
                 </section>
                 <section className='mt-6'>
                  <p><b>Admin only! </b> </p>
                  <button className='button is-primary is-large  mt-3' onClick={pickWinnerHandler}>Pick Winner </button>
                 </section>
                 <section>
                  <div className="continer has-text-danger mt-4"> 
                  <p> {error} </p>
                  </div>
                 </section>
                 <section>
                  <div className="continer has-text-danger mt-4"> 
                  <p> {success} </p>
                  </div>
                 </section>

            </div>
            <div className={`${styles.lotteryinfo} column is-one-third `}>
              <section className='mt-5'>
                <div className='card'>
                  <div className='card-content'>
                    <div className='content'>
                      <h2> Lottery History</h2>
                      { 
                       (lotteryHistory && lotteryHistory.length > 0) && lotteryHistory.map(item =>  {
                        if(lotteryId != item.id){ 
                                return <div className='history-entry mt-4' key={item.id}>
                                    <div> Lottery #{item.id} Winner: </div>
                                    <div>
                                       <a href={`https://etherscan.io/address/${item.address}`} target="_blank">
                                      {item.address} </a>
                                      </div>
                                    </div>
                       }}) 
                      }
                    </div>
                  </div>
                </div>
              </section>
              <section className='mt-5'>
                <div className='card'>
                  <div className='card-content'>
                    <div className='content'>
                      <h2> Players ({lotteryPlayers.length}) </h2>
                        <ul className="ml-0"> 
                          {( lotteryPlayers && lotteryPlayers.length > 0) && lotteryPlayers.map( (player, index) => {
                        return  <li  key={`${player} - ${index}`}> <a href={`https://etherscan.io/address/${player}` }target="_blank">
                          {player} </a></li>

                          })}</ul>
                      </div>
                  </div>
                </div>
              </section>
              <section className='mt-5'>
                <div className='card'>
                  <div className='card-content'>
                    <div className='content'>
                      <h2> Lottery Pot </h2>
                          <p> { lotteryPot} Matic</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            </div>
            </section>  
       </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2022 Assiduous Tutorials. </p> 
      </footer>
    </div>
  )
}
