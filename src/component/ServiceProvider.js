import React, { useState,useRef } from "react";
import Select from 'react-select';

import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Form, Row, Col} from "react-bootstrap";

import {Action_Type, Docs_Score_Map, Status_Type,Allow_File_Name} from '../common/Constant';
import {prepareUploadInput,setLoadingState} from '../common/utils';

import Web3 from "web3";
import contract from "../abi/UserScore.json";

const actions = [
    { label: "Type1", value: "doc1" },
    { label: "Type2", value: "doc2" },
    { label: "Type3", value: "doc3" },
    { label: "Type4", value: "doc4" },
    { label: "Type5", value: "doc5" },
    { label: "Type6", value: "doc6" },
    { label: "Type7", value: "doc7" },
    { label: "Type8", value: "doc8" }
];

function  FileUpload ({index,fileName, onChange, onRemove, hideDelete, fileNames, setTypes, types}){
    const typeRef = useRef();
    const ref = useRef();
    const validateType = ({label,value}, name)=>{
        let newtypes = Object.assign(types,{[name]:value});
        setTypes({...newtypes})
    };

    const validate = (inputName,event)=>{
        let type = typeRef.current?.getValue()[0]?.value
        if(!type){
            alert("Please select type first");
            ref.current.value = "";
            return;
        }
        let docName = event?.target?.files[0]?.name;
        let name = docName.split('.').slice(0, -1).join('.')
        if(type && docName){
            onChange(type,name)
        }
        /*else{

            alert("Please select file name with "  +  Allow_File_Name.join(",") +  " only");
            ref.current.value = "";
        }*/
    }
    const onRemoveHandler = (index, typeRef, name)=>{
        console.log("index, ref, name",index, ref, name)
        let val = typeRef?.current?.getValue()[0]?.value;
        //let docName = typeRef?.current?.getValue()[0]?.value;
        let newtypes = Object.assign(types,{});
        delete newtypes[val];
        setTypes({...newtypes})
        onRemove(index, val)
    }
    let options = actions.filter((act)=>{return Object.values(types).indexOf(act.value) ==-1})

    return (
        <Form.Group as={Row}>
        <Col sm={2}>
            <Select options={ options } name={fileName} ref={typeRef} onChange={(e)=>{validateType(e,fileName)}}/>
        </Col>
        <Col>
            <Form.Control key={index}
                 type="file"
                 name={fileName}
                 className="custom-file-label"
                 id="inputGroupFile01"
                 label={fileName}
                  ref={ref}
                  onChange={(e) => validate(fileName, e)}
            />
        </Col>
        <Col>
            {!hideDelete &&<Button size="sm" variant="primary" onClick={(e)=>onRemoveHandler(index,typeRef,fileName)}>Delete</Button>}
        </Col>
        </Form.Group>
    )
}
function ServiceProvider({currentAccount}) {
    const maxFiles = 8;
    const [fileNames, setFileNames] = useState({});
    const [files, setFiles] = useState(['doc1']);
    const [types, setTypes] = useState({});

    const [loading, setLoading] = useState({status:null,message:'',actionType:''});
    const navigate = useNavigate();


    const addMoreFile = ()=>{
        files.push(`doc${files.length+1}`)
        setFiles([...files]);
    }

    const onRemove = (index,fileName) => {
        files.splice(index,1);
        setFiles([...files]);
        if(fileName && Object.keys(fileName) > 0){
            delete  fileNames[fileName]
            setFileNames(...fileNames)
        }
    }

    const getDocScore  = (name) => {
        return Docs_Score_Map[name]
    }

    const setSelectedFiles = (inputName,docName)=>{
        let obj = Object.assign(fileNames,{[inputName]:getDocScore(inputName)})
        setFileNames({...obj})
    }
    const uploadFileHandler = async () => {
        const { ethereum } = window;
        const web3 = new Web3(ethereum);
        const erc20Contract = new web3.eth.Contract(
            contract.abi,
            process.env.REACT_APP_CONTACT_ADDRESS,
            web3.get
        );
        try{
            setLoadingState({status: Status_Type.PENDING, message: 'Processing.... Please wait',actionType: Action_Type.UPLOAD},setLoading)
            let res = await erc20Contract.methods.upload(prepareUploadInput(fileNames)).send({from:currentAccount});
            setLoadingState({status: Status_Type.SUCCESS ,message:`Upload is complete please see the transiction  <a target="_blank" rel="noreferrer" href=https://ropsten.etherscan.io/tx/${res}>here</a>`, actionType: Action_Type.UPLOAD},setLoading)
            navigate("/user");
        }
        catch (e){
            console.log("error", e);
            setLoadingState({status: Status_Type.ERROR ,message:e.message, actionType: Action_Type.UPLOAD},setLoading)
        }
    }
    return (
        <div className='main-app service_provider_sec'>
            <>
                {
                    files.map(function(file, i){
                        return <FileUpload setTypes={setTypes}  types={types} key={file} index={i} fileName={file} onChange={setSelectedFiles} onRemove={onRemove} hideDelete={files.length <= 1} ></FileUpload>
                    })
                }
                <Row>
                    {files.length < maxFiles && <Button size="sm" variant="primary" onClick={addMoreFile}>Add More</Button>}
                </Row>
                <Row>
                    {loading.actionType === Action_Type.UPLOAD && loading.message ? <span style={loading.status == Status_Type.ERROR ? {color: 'red'} : {color:'#fff'}}  dangerouslySetInnerHTML={{__html: loading.message}}></span>:''}
                </Row>

                <Row>
                    {Object.keys(fileNames).length > 0 && <Button size="sm" variant="primary" onClick={uploadFileHandler}>Submit</Button>}
                </Row>
            </>
        </div>
    );
}

export  default  ServiceProvider;