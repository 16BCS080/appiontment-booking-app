import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { useState, useEffect } from "react"; 
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'react-calendar/dist/Calendar.css';


import DatePicker from 'rsuite/DatePicker'; 
import DateRangePicker from 'rsuite/DateRangePicker';
import 'rsuite/dist/rsuite.min.css';

import DropdownList from './DropdownList'

/**
 *Header
 */

const  title = <>
 <h3 class="text-center">Appointment Booking </h3>
 <p class="font-weight-light" >If you would like to arrange for a consultation appointment with Dr.Xavler,please fill out this Appointment form and we will get back to you as soon as possible.</p>
 </>;
const head = ReactDOM.createRoot(document.getElementById('header'));
head.render(title);

/**
 *footer
 */

function Footer() { 
  return (
      <>  
      </>
    );
} 
const foot = ReactDOM.createRoot(document.getElementById('footer'));
foot.render(<Footer />)  




function MyForm() {
  const [users, setUsers] = useState([]) ;
  const [inputs, setInputs] = useState({});
  //const gender = [ 'male' , 'female' ] ; 
  
  const fetchData = () => {
    fetch("http://localhost:5000/api")
      .then(response => {
        return response.json()
      })
      .then(data => {        
        console.log(data);
        setUsers(data)
      })
  }
  useEffect(() => {
    fetchData()
  }, [])


  const handleChange = (event) => {
    console.log(event); 
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }
  const updateFields_appointment_date = (date, dateString) => { 
    inputs['appointment_date'] = JSON.stringify(date).slice(1,11) ; 
  }
  const updateFields_timerange = (date, dateString) => {
    inputs['timerange'] = date.map(function(data){ return new Date(data).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") ;  }).join(' to ') ; 
  }


  const handleSubmit = (event) => {
      
    var data = [];
    event.preventDefault(); 
    var appointment_timing_select = document.getElementById('appointment_timing');
    inputs['appointment_timing'] = appointment_timing_select.options[appointment_timing_select.selectedIndex].value; 

    inputs['appointment_date'] = document.querySelector('.appointment_date').querySelector('input').value; 
     

    data = inputs ;

    var post_data = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body:  JSON.stringify(data)
      } ; 
     
    fetch('http://localhost:5000/store-data', post_data )
        .then(response => response ).then(data => { 
          alert("data saved") ;
          setInputs([]); 
          fetchData() ;

        });  
  } 

   


  return (
    <form onSubmit={handleSubmit} class="mt-4">      
      <DropdownList />
      <div class="row mb-3"> 
        <label class="col-sm-4 col-form-label" > Name </label>
        <div class="col-sm-4">
            <input
              class="form-control" 
              type="text" 
              name="user_first_name" 
              placeholder="First"            
              value={inputs.user_first_name || ""} 
              onChange={handleChange}
            />
        </div> 
        <div class="col-sm-4">     
            <input
              class="form-control" 
              type="text" 
              name="user_last_name" 
              placeholder="Last"            
              value={inputs.user_last_name || ""} 
              onChange={handleChange}
            />
          </div>
       </div>
      <div class="row mb-3"> 
      <label  class="col-sm-4 col-form-label" > ADDRESS </label>
      <div class="col-sm-8 mt-2"> 
          <input            
            class="form-control"  
            type="text" 
            name="street_address" 
            placeholder="Street address"            
            value={inputs.street_address || ""} 
            onChange={handleChange}
          /> 
      </div>
      <div class="col-sm-8 offset-sm-4 mt-2"> 
          <input            
            class="form-control"
            type="text" 
            name="street_address_2" 
            placeholder="Street address line 2"            
            value={inputs.street_address_2 || ""} 
            onChange={handleChange}
          />  
      </div>
      <div class="col-sm-4 offset-sm-4 mt-2"> 
          <input            
            class="form-control" 
            type="text" 
            name="city" 
            placeholder="City"            
            value={inputs.city || ""} 
            onChange={handleChange}
          /> 
      </div>
      <div class="col-sm-4 mt-2"> 
          <input            
            class="form-control" 
            type="text" 
            name="state" 
            placeholder="State"            
            value={inputs.state || ""} 
            onChange={handleChange}
          /> 
      </div>
      <div class="col-sm-4 offset-sm-4 mt-2"> 
          <input            
            class="form-control"
            type="number" 
            name="pincode" 
            placeholder="Pincode"            
            value={inputs.pincode || ""} 
            onChange={handleChange}
          /> 
      </div>
      <div class="col-sm-4 mt-2"> 
          <input            
            class="form-control"    
            type="text" 
            name="country" 
            placeholder="Country"            
            value={inputs.country || ""} 
            onChange={handleChange}
          />
        </div>    
      </div>
      <div class="row col-sm-4 offset-sm-5">
        <input type="submit" class="custom-btn" value="BOOK NOW" />
      </div>  
          </form>
  )
}

const body = ReactDOM.createRoot(document.getElementById('content-body'));
body.render(<MyForm />);
/*
<label class="col-sm-4 col-form-label" > Appointment list </label>

      {users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} -{user.appointment_date} - {user.appointment_timing}</li>
          ))}
        </ul>
      )} 

*/




/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/
