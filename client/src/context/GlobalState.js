import React, { createContext, useEffect, useReducer, useState } from 'react';
import AppReducer from './AppReducer';
import { useHistory } from "react-router-dom";
import API from '../axios';
import moment from 'moment';

const initialState = {
    employees: []
}

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    const [err,setErr] = useState(false);
    let history = useHistory();

    useEffect(() => {
        const getData = async () => {
            try{
                const response = await API.get('employees');
                
                // console.log('getdata',response.data);
                if(response.data.length > 0) {

                    dispatch({
                        type: 'ADD_EMPLOYEES',
                        payload: response.data
                    });
                }
            } catch(e) {
                console.log('err',e)
                setErr(true);
            }
        }
        getData();
    },[]);
    console.log('state',state)

    async function removeEmployee(id) {
        try {
            const response = await API.delete(`employee/${id}`);
            if(response.status === 200) {
                dispatch({
                    type: 'REMOVE_EMPLOYEE',
                    payload: id
                });
                window.location.href ="/";
            } 
        } catch(e) {
            console.log('Error occured',)
        }
    };

    async function addEmployee(newEmployee) {
        // console.log(newEmployee);

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        try {
            let formData = new FormData();
            const {id,name,age,email,dob,address,photo} = newEmployee;
            formData.append('id', id);
            formData.append('name', name);
            formData.append('age', parseInt(age));
            formData.append('email', email);
            formData.append('dob', moment(dob, ["YYYY","MM","DD"]));
            formData.append('address', address);
            formData.append('photo', photo);

            const response = await API.post('employee', formData, config);
            // console.log('res in add',response.data)

            if(response.status === 201) {
                const newEmployee = response.data;

                delete newEmployee._id;
                delete newEmployee.__v;
                delete newEmployee.createdAt;
                delete newEmployee.updatedAt;

                dispatch({
                    type: 'ADD_EMPLOYEES',
                    payload: newEmployee
                });
                window.location.href ="/"
            }
        } catch(e) {
            console.log("error occured", e);
        }        
    };

    async function editEmployee(employees) {
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        try {
            let formData = new FormData();
            const {id,name,age,email,dob,address,photo} = employees;
            formData.append('name', name);
            formData.append('age', parseInt(age));
            formData.append('email', email);
            formData.append('dob', moment(dob, ["YYYY","MM","DD"]));
            formData.append('address', address);
            formData.append('photo', photo);

            const response = await API.patch(`employee/${id}`, formData, config);
            // console.log('res in add',response.data)

            if(response.status === 200) {
                const newEmployee = response.data;

                delete newEmployee._id;
                delete newEmployee.__v;
                delete newEmployee.createdAt;
                delete newEmployee.updatedAt;

                dispatch({
                    type: 'EDIT_EMPLOYEE',
                    payload: newEmployee
                });
                window.location.href ="/"
            }
        } catch(e) {
            console.log("error occured", e);
        }
    };

    return (<GlobalContext.Provider value={{
        employees: state.employees,
        removeEmployee,
        addEmployee,
        editEmployee
    }}>
        {children}
    </GlobalContext.Provider>);
}