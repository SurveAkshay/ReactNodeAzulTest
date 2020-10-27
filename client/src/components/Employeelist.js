import React, { Fragment, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Link } from 'react-router-dom';

export const Employeelist = () => {
    const { employees, removeEmployee, editEmployee } = useContext(GlobalContext);
    // console.log('employees in list',employees);
    const[localState, setLocalState] = useState(undefined);
    useEffect(() => {
        setLocalState(employees)
    }, [employees]);
    return (
        <Fragment>
            { (typeof localState !== 'undefined' && localState.length > 0) ? (
            <Fragment>
                <table className="table table-bordered text-center emptable">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No</th>
                            <th scope="col">Photo</th>
                            <th scope="col">Name</th>
                            <th scope="col">Age</th>
                            <th scope="col">Email</th>
                            <th scope="col">Address</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees[0].map((employee, indx) => (
                            <tr key={employee.id}>
                                <td>{indx + 1}</td>
                                <td style={{'width': '100px'}}>
                                    <a href={ employee.photo ? employee.photo : 'https://via.placeholder.com/350x350?text=Not+available'} target="_blank" className='bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center'>View</a>
                                </td>
                                <td style={{'width': '200px'}}>{employee.name}</td>
                                <td>{employee.age}</td>
                                <td style={{'width': '300px'}}>{employee.email}</td>
                                <td style={{'width': '500px'}}>{employee.address}</td>
                                <td style={{'width': '90px'}}>
                                    <Link to={`/edit/${employee.id}`}>
                                        <button className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center" > Edit</button>
                                    </Link>
                                </td>
                                <td style={{'width': '90px'}}>
                                    <button className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center" type='button' onClick={() => removeEmployee(employee.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Fragment>) : <p className="text-center bg-gray-100 text-gray-500 py-5">No Records Found</p>}
        </Fragment>
    )
}