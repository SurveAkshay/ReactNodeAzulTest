const express = require('express');
const fs = require('fs');
const path = require('path');
const Employee = require('../models/employee');
const router = new express.Router();

const imgMiddleware = require('../middleware/imgMiddleware');

router.post('/employee', imgMiddleware.single("photo"), async (req,res) => {
    var employee;
    
    const url = req.protocol + '://' + req.get('host');
    // console.log(url)
    if(!req.file) {
        employee = new Employee({
            ...req.body
        })
    } else {
        employee = new Employee({
            ...req.body,
            photo: `${url}/static/${req.file.originalname}`
        })
    }
    try {
        const employees = await Employee.find({});
        const exists = employees.find(emp => emp.id == employee.id);
        if(exists) {
            res.status(400).send('Id must be unique');
        } else {
            await employee.save()
            // console.log(employee)
            res.status(201).send(employee)
        }
            
    } 
    catch (e) {
        res.status(400).send(e);
    }
})

router.get('/employees', async (req,res) => {
    try {
        const employees = await Employee.find({});
        
        if(!employees) { 
            return res.status(404).send() 
        }

        res.send(employees)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/employee/:id', imgMiddleware.single("photo"), async (req,res) => {
    const id = req.params.id;
    const url = req.protocol + '://' + req.get('host');
    var employee;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','age','email','dob','address','photo'];
    const isvalidOperation = updates.every((update) => allowedUpdates.includes(update) );
    if(!isvalidOperation) {
        return res.status(400).send({error: 'invalid updates!'})
    }
    if(!req.file) {
        try {
            employee = await Employee.findOne({id})
           
            if(!employee) {
                return res.status(404).send('no employee found to update')
            }

            updates.forEach((update) => employee[update] = req.body[update])

            await employee.save();
            
            res.send(employee);
        } catch (e) {
            res.status(400).send(e)
        }
    } else {
        try {
            employee = await Employee.findOne({id})
           
            if(!employee) {
                return res.status(404).send('no employee found to update')
            }
            
            updates.forEach((update) => {
                if(req.file) {
                    employee.photo = `${url}/static/${req.file.originalname}`;
                }
                employee[update] = req.body[update]
            })

            await employee.save();
            
            res.send(employee);
        } catch (e) {
            res.status(400).send(e)
        }
    }
})

router.delete('/employee/:id', async (req,res) =>{
    const id = req.params.id;
    try {
        const employee = await Employee.findOneAndDelete({id});
        if(!employee) {
            return res.status(404).send('no employee found to delete')
        }
        res.send(employee);
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;