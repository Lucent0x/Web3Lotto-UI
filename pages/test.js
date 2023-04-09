import { useState, useEffect } from 'react';
import Head from 'next/head';
import Web3 from "web3";
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css';



export default function Wally() {

const web3 = new Web3("https://eth-goerli.g.alchemy.com/v2/enO41j3uJjnTZ2QceAG9bGAEluHhl78N");
const [accounts, setAccounts ] = useState( [])
const [present, setPresent ] = useState( {})

setInterval( 
    accounts.forEach(account => {
            
    document.getElementById('bb').innerHTML = 
   account.address

}), 100)
//functions

const createAccount = async ( ) => {

    const newAcc = await web3.eth.accounts.create();
    accounts.push(newAcc)
    setPresent(accounts[0]);
    setAccounts(accounts)
    console.log(accounts);
}
  
const showAccounts = ( ) => {
    list.classList.toggle(styles.toggler);
}
return (
    <div>
        <Head>
        <title>Matic lotto dApp</title>
        <meta name="description" content="A simple polygon matic dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="navbar mt-4 mb-4">
          <div className='container'>
            <div className='' >
                <button className='button is-link' onClick={createAccount} >Create Account</button> 
            </div>
            <div className='navbar-end'>
                <button className='button is-link' onClick={showAccounts} >List Accounts</button>
            </div>
          </div>
        </nav>
      <main>
        <div className='card'>
                  <div className='card-content'>
                    <div className='content'>
            <h1> Current Account </h1>
       <h2>account 1 : </h2>{present.address} 
       <h2> Private key : </h2>{present.privateKey}
       <p id='bb'></p>
       </div>
       </div>
        </div>

       <section className='mt-5'>
        
                <div className='card'>
                  <div className='card-content' id='list'>
                    <div className='content'>
                      <h2> Account ({accounts.length}) </h2>
                        <ul className="ml-0"> 
                          {  accounts.map( (account, index) => {
                        return  <li  key={`${account} - ${index}`}> 
                        <b>Address: </b> {account.address} <br/>
                       <b>privateKey:</b> {account.privateKey}<br/><br/>
                        </li>
                            
                          }) }</ul>
                      </div>
                  </div>
                </div>
              </section>
      </main>
      </div>
)

}