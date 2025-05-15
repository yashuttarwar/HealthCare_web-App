import React, { useState } from 'react'
import { useEffect } from 'react';
import doctorlist from "../assets/data/doctorlist.json"; // Ensure the path is correct
import DoctorCard from './DoctorCard';
import "./DoctorCard.css";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  useEffect(() => {
setTimeout(() => {}, 2000)
    setDoctors(doctorlist);
    setLoading(false);
    console.log(doctors);
  },[])
  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }
  function handerClickDoctor() {
    console.log("Doctor Search Clicked");
    console.log(inputValue);
    const filtered = doctors.filter((doctor) =>
      doctor.city.toLowerCase().includes(inputValue.toLowerCase())
    );
    console.log(filtered);
    setFilteredDoctors(filtered);
  }
  return (
    <>
     <div className="doctor-list">
       <h1>Find a best Doctor in your City </h1>
       <div className='doctor-input'>
        <input value={inputValue}type="text" placeholder='Enter a Your City Name' onChange={(event)=>setInputValue(event.target.value)} />
        <button className='doctor-click' onClick={handerClickDoctor}>Search</button>
       </div>
       <div className="doctor-list-container">
        {filteredDoctors.map((doctor) => (
          // <div key={doctor.id} className="doctor-card">
          //   <img src={doctor.image} alt={doctor.name} />
          //   <h2>{doctor.name}</h2>
          //   <p>{doctor.specialization}</p>
          //   <p>{doctor.city}</p>
          //   <p>{doctor.contact}</p>
          // </div>
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}</div>
     </div>
    </>
  )
}

export default DoctorList