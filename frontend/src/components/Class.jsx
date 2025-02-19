import React from "react";
import { useNavigate,useParams } from "react-router-dom";

const Class = () => {
    const navigate = useNavigate();
    const {id} = useParams();  
    return (
      <div>
        <h1>Class {id}</h1>
      </div>
    );
  };

export default Class;
