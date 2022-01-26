import React, {useState } from 'react';

import {
  Link
} from "react-router-dom";

import { Button,Row,Container } from 'react-bootstrap';
import {} from 'dotenv/config'

import {Action_Type, Status_Type} from './common/Constant.js';

import './Home.css';
import {connectWalletHandler} from "./common/utils";

const ConnectWallet = ({setCurrentAccount,setNetwork}) => {
    const onClick = ()=>{
        connectWalletHandler(setCurrentAccount,setNetwork)
    }
    return (

    <Row className="customRow align-items-center justify-content-center" style={{minHeight:"500px"}} >
        <Button size="lg"  variant="primary" onClick={onClick}>
            Connect Wallet
        </Button>
    </Row >
    )
};


function Home({currentAccount,setCurrentAccount,network,setNetwork}) {
    console.log("currentAccount",currentAccount);
    console.log("network",network);
    console.log("currentAccount",setCurrentAccount);
    console.log("currentAccount",setNetwork);

    const [loading, setLoading] = useState({status:null,message:'',actionType:''});
    return (
        <div className='main-app'>
            {!currentAccount ? <ConnectWallet setCurrentAccount={setCurrentAccount} setNetwork={setNetwork}/>:
                <>
                <h1>Upload Score</h1>

                <h3>Selected Account:{currentAccount} </h3>
                {network === process.env.REACT_APP_NETWORK &&
                    <Container className="containerWrapper">

                    {loading.actionType === Action_Type.MINT  && loading.message ? <span style={loading.status === Status_Type.ERROR ? {color: 'red'} : {}} dangerouslySetInnerHTML={{__html: loading.message}}></span>:''}
                    <Row className="customRow align-items-center justify-content-center" >
                        <Link to="/service-provider">
                             <Button size="lg"  variant="primary"  >Service Provider</Button>
                         </Link>
                        <Link to="/user">
                             <Button size="lg" variant="primary">User</Button>
                        </Link>
                    </Row >
                </Container>
                }
                </>
            }
        </div>
    )
}
export default Home;
