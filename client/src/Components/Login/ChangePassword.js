import axios from "axios";
import React,{useRef, useState} from "react";
import { Form,FloatingLabel,Button } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
const ChangePassword = () => {
    const passwordRef=useRef();
    const [openET,setOpenET]=useState(false)
    const params=useParams()
    async function addData(e){
        e.preventDefault();
        const response=await axios.post(`http://localhost:5000/updatePassword/${params.Id}`,{password:passwordRef.current.value})
        const data=await response.data
        try {
            if (data.ok) {
                setOpenET(true)  
                alert(data.message) 
            }else{
              throw new Error()
            }
        } catch (error) {
            alert(data.message)
        }
    }
  return (
    <div>
      <Form className="d-grid" onSubmit={addData}>
        <FloatingLabel
          controlId="floatingInput"
          label="Change Password"
          className="mb-3 text-dark"
        >
          <Form.Control
            type="text"
            placeholder="Enter new password"
            ref={passwordRef}
            required
          />
        </FloatingLabel>
        <Button type="submit">SUBMIT</Button>
      </Form>
      {openET&&<Redirect to='/'/>}
    </div>
  );
};

export default ChangePassword;
