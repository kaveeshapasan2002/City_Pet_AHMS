import React, { useEffect, useState } from 'react';
import axios from "axios";
import Medi from '../Pet/medi';


const URL="http://localhost:5000/medies";

const fetchHandler=async ()=>{
  return await axios.get(URL).then((res)=>res.data);
}
function MediDetails() {


const[Medies,setMedies]=useState();
useEffect(()=>{
  fetchHandler().then((data)=>setMedies(data.Medies));
},[])





  return (
    <div>
      <h1>this is details form</h1>
      <div>
        {Medies&& Medies.map((Medies,i)=>(
          <div key={i}>
            <Medi Medies={Medies}/>
            </div>
        ))}


      </div>
    </div>
  )
}

export default MediDetails;
