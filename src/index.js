import React ,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom';

import Home from './Home';
import  ServiceProvider from './component/ServiceProvider';
import  User from './component/User';
//import  ConnectWallet from './component/ConnectWallet';
import  Header from './component/Header';

import {connectWalletHandler,isWalletConnected} from './common/utils'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

const AppRouts = ({currentAccount,network, setNetwork, setCurrentAccount}) => {
    return (
        <>
            <Router>
                <Header/>
                <Routes>
                    <Route exact path="/" element={<Home currentAccount={currentAccount} network={network} setNetwork={setNetwork} setCurrentAccount={setCurrentAccount} />}/>
                    <Route exact path="/user" element={!currentAccount ? <Navigate to="/" /> : <User currentAccount={currentAccount}/>}/>
                    <Route exact path="/service-provider" element={!currentAccount ? <Navigate to="/" /> : <ServiceProvider currentAccount={currentAccount}/>}/>
                </Routes>
            </Router>
        </>
    );
};



const App = () => {
    const [currentAccount,setCurrentAccount] = useState('');
    const [network,setNetwork] = useState('');
    useEffect(()=>{
        connectWalletHandler(setCurrentAccount,setNetwork);
    },[]);
    return (
        <AppRouts currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} setNetwork={setNetwork} network={network}/>
    );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
