import React from "react";

const Input = (props) => {
  const { label, error, name, onChange, type, defaultValue } = props;
  let className = "form-control";

  if (error !== undefined) {
    className += " is-invalid";
  }

  return (
    <div className='mb-3'>
      <label className='form-label'>{label}</label>
      <input
        className={className}
        name={name}
        onChange={onChange}
        type={type}
        defaultValue={defaultValue}
      ></input>
      <div className='invalid-feedback'>{error}</div>
    </div>
  );
};

export default Input;
