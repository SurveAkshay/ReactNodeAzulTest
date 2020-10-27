import React, { Fragment, useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';

import { Formik, Form, Field } from 'formik';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import * as Yup from 'yup';
import * as moment from 'moment';

export const Addemployee = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState('');
    const [photoUrl,setPhotoUrl] = useState('');
    const [imgError,setImageError] = useState('');
    const [photoName,setPhotoName] = useState('Upload Profile Picture');
    const [startDate,setStartDate] = useState(new Date(moment().subtract(20, 'years').calendar()))
    const { addEmployee, employees } = useContext(GlobalContext);
    let history = useHistory();

    const labelClassNames = "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";
    const inputClassNames = "w-full p-2 min-height block tracking-wide text-gray-700 text-xs font-bold mb-2 border-b";
    const initValues = { name:'',age:'' ,email:'',dob:new Date() ,address:'',photo:'' }
    const SUPPORTED_FORMATS = ["jpg", "jpeg", "png"];
    const formStyle = {
        'padding':'20px',
        'background':'#f1f1f1',
        'borderRadius': '5px'
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Required')
            .test('alphabets', 'Name must only contain alphabets', (value) => {
                return /^[A-Za-z ]+$/.test(value);
            }),
        age: Yup.string()
            .required('Required')
            .test('number', 'Age must only contain Numbers', (value) => {
                return /^[0-9]+$/.test(value);
            })
            .test('number', 'Age Must be greater than or equal to 20', (value) => {
                return /^([2-9]\d|[0-9]\d{2,})$/.test(value);
            }),
        email: Yup.string().email('Invalid email').required('Required'),
        dob : Yup.date()
    });
    
    const handleImageChange = e => {
        // console.log(e.target.files[0]);
        let value = e.target.files[0].name;
        let ind = value.lastIndexOf('.');
        let ext = value.substring(ind+1);
        if(!SUPPORTED_FORMATS.includes(ext)) {
            setImageError('Only image file type is allowed!');
        } else {
            setImageError('');
            setPhotoUrl(e.target.files[0]);
            setPhotoName(value);
        }
    }

    const handleFormSubmit = async values => {
        // console.log(employees)
        const newEmployee = {
            id: '_' + Math.random().toString(36).substr(2, 9),
            name: values.name,
            age: values.age,
            email: values.email,
            dob: values.dob,
            address:values.address,
            photo: photoUrl
        }
        // console.log(newEmployee)

        addEmployee(newEmployee);
        // history.push("/");
    }

    return (
        <Fragment>
            <div className="w-full max-w-sm container mt-20 mx-auto mb-20">
                <Formik 
                    initialValues={initValues} 
                    validationSchema={validationSchema} 
                    onSubmit={(values, actions) => {
                        handleFormSubmit(values);
                        actions.setSubmitting(false);
                    }}
                >
                    {({ errors, touched, isSubmitting }) => (
                    <Form autoComplete="off" style={formStyle} >
                        <div className="w-full mb-5">
                            <label className={labelClassNames} htmlFor="name">Name</label>
                            <Field autoComplete="off"  className={inputClassNames} name="name" id="name" />
                            {touched.name && errors.name ? <p className="text-red-900" >{errors.name}</p> : null}
                        </div>
                        <div className="w-full mb-5">
                            <label className={labelClassNames} htmlFor="age">Age</label>
                            <Field autoComplete="off"  className={inputClassNames} name="age" id="age" />
                            {touched.age && errors.age ? <p className="text-red-900" >{errors.age}</p> : null}
                        </div>
                        <div className="w-full mb-5">
                            <label className={labelClassNames} htmlFor="email">Email</label>
                            <Field autoComplete="off"  className={inputClassNames} name="email" id="email" />
                            {touched.email && errors.email ? <p className="text-red-900" >{errors.email}</p> : null}
                        </div>
                        <div className="w-full mb-5">
                            <label className={labelClassNames} htmlFor="dob">Date of birth</label>
                            <DatePicker id="dob" name='dob' 
                            className={inputClassNames} selected={startDate}
                            maxDate={moment().subtract(20, "years").toDate()} 
                            onChange={date => setStartDate(new Date(date))}
                            showDisabledMonthNavigation
                             />
                        </div>
                        <div className="w-full mb-5">
                            <label className={labelClassNames} htmlFor="address">Address</label>
                            <Field autoComplete="off" className={inputClassNames} name="address" id="address" component="textarea" rows="4" cols="50"  />
                        </div>
                        <div className="w-full mb-5">
                            <label className={labelClassNames  + " select-style"} htmlFor="photo">{photoName}</label>
                            <Field autoComplete="off"  className={inputClassNames} name="photo" id="photo" type="file" accept="image/*" onChange={handleImageChange} style={{'display':'none','width':'30px'}} />
                            {photoUrl ? <a className={labelClassNames  + " select-style"} target="_blank" href={URL.createObjectURL(photoUrl)} title="View Photo">View</a> : null}
                            {imgError ? <p className="text-red-900" >{imgError}</p> : null}
                        </div>
                        <div className="flex items-center justify-between">
                            {(Object.keys(errors).length > 0 || !(imgError === "") ) ? null : (
                            <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-5 bg-green-400 w-full hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                submit
                            </button>)}
                        </div>
                        <div className="text-center mt-4 text-gray-500"><Link to='/'>Cancel</Link></div>
                    </Form>
                    )}
                </Formik>
            </div>
        </Fragment>
    )
}