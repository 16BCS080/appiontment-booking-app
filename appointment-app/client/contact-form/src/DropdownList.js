import React, {Component } from 'react' 
import './App.css';
import DatePicker from 'rsuite/DatePicker'; 


export class DropdownList extends Component {
  constructor(props) {
    super(props)
    this.state = {
    id: '', 
    StateData: [], 
    }
  }

updateFields_appointment_date = (date, dateString) => { 
  var ap_date =JSON.stringify(date).slice(1,11).split("-") ;


var Appointment_date = { 'appointmentSlotDate' : ap_date.reverse().join("/")  } ;
 this.setState({
            appointmentSlotData: []  
          });

 var post_data = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(Appointment_date)
      } ; 

      fetch("/appointmentslots",post_data)
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.setState({ 
              StateData: data , 
          });
        })


}
render() {  
          return (  
                <>
                  <div class="row mb-3">
                      <label class="col-sm-4 col-form-label" > Appointment Date </label>
                        <div class="col-sm-8 appointment_date ">
                          <DatePicker
                                name="country" onChange={this.updateFields_appointment_date}
                                class="form-control" name = "appointment_date"
                                format="dd/MM/yyyy"
                                showMeridian
                                ranges={[]} 
                                style={{ width: 260 }} 
                              />  
                      </div>
                  </div>
                  <div class="row mb-3"> 
                        <label class="col-sm-4 col-form-label" >Appointment Time </label>
                        <div class="col-sm-8">
                          <select className="form-control slct" id="appointment_timing" name="state"  >  
                            <option key="0" value="0">Please select</option> 
                            {this.state.StateData.map((e, key) => {  
                            return <option key={key} value={e.id} disabled={e.booked} > Slot:- {e.id} - {e.startTime}-{e.endTime} </option>;
                            })}  
                          </select> 
                       </div>
                  </div>   
                </>  
              )  
            }  
}  
export default DropdownList 