import React from 'react'
import "./DoctorCard.css";

function DoctorCard({doctor}) {
    const handlerClickBookApp = () => {
        navigator.clipboard.writeText(doctor.contact).then(() => {
            alert("Contact number copied to clipboard!");
          });
    }
 const doctorImage = "/doctor_photo.jpg";
  return (
    <div className="doctor-card">
      <img className='doctor-img' src={doctorImage} alt={`${doctor.name}'s profile`} />
      <div className='doctor-info'> <h3>{doctor.name}</h3>
      <p>{doctor.specialty}</p>
      <p>{doctor.experience} years of experience</p>
      <p>{doctor.location}</p>
      <h3>{doctor.consultationFee}</h3>
      <button onClick={handlerClickBookApp} className='bookAppoint'>Book Appointment</button> </div>
      </div>
  )
}

export default DoctorCard