import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { api } from 'ernst_stephen_fischer/trpc/react'
import React, { useState } from 'react'

interface Employee {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    status: boolean,
    role: string
}

interface CreateEmployee {
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    status: boolean,
    role: string
}

interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
}

interface Props {
    employeeData: Employee,
    manager: Manager[],
    edit: boolean,
    exit(): void
}
const Employee_Edit_Create = (props: Props) => {
    const StatusOptions = ["Active", 'Inactive']
    const [firstName, setFirstName] = useState(props.employeeData.firstName)
    const [lastName, setLastName] = useState(props.employeeData.lastName)
    const [telephoneNumber, setTelephoneNumber] = useState(props.employeeData.telephoneNumber)
    const [emailAddress, setEmailAddress] = useState(props.employeeData.emailAddress)
    const [manager, setManager] = useState<Manager>()
    const [status, setStatus] = useState(props.employeeData.status)
    const getStatusValue = () => {
        if(status)
            return "Active"
        return "Inactive"
    }
    const updateEmployee = api.update.updateEmployees.useMutation()
    const createEmployee = api.insert.insertEmployees.useMutation()
    const EmployeeManagerLink = api.update.updateEmployeeManagerLink.useMutation()
    const ManagerEdit = api.update.updateManager.useMutation()
    const EditEmployeeDetails = (data: Employee) => {
        if(data.role==='Manager'){
            ManagerEdit.mutate({managerName: data.firstName + " " + data.lastName, oldEmail: props.employeeData.emailAddress, newEmail: data.emailAddress})
        }
        updateEmployee.mutate(data)
        if(manager){
            EmployeeManagerLink.mutate({EmployeeId: props.employeeData.id, managerId: manager.id})
        }
    }
    const CreateEmployee = (data: CreateEmployee) => {
        createEmployee.mutate(data)
    }
    return (
        <div>
            <div style={{ display: 'flex', paddingTop: '0.1vh', paddingLeft: '2%' }}>
                <Box
                    height={'5vh'}
                    width={'90%'}
                    my={4}
                    display="flex"
                    flexDirection='column'
                    justifyContent='center'
                    p={2}
                    sx={{ border: '2px solid grey', alignSelf: 'center' }}>
                    <Typography> HR Administration System</Typography>
                </Box>
            </div>
            <div style={{ display: 'flex', paddingTop: '0.1vh', paddingLeft: '2%' }}>
                <Grid2 container spacing={3} >
                    <Grid2 xs='auto' >
                        <Box
                            height={'34.3vh'}
                            width={'20vh'}
                            display="grid"
                            sx={{ border: '2px solid grey' }}>
                            <Typography> Menu </Typography>
                        </Box>
                    </Grid2>
                    <Grid2 xs='auto' >
                        <Typography sx={{ paddingBottom: '2%' }}> Create / Edit Employee </Typography>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%' }}> First Name </Typography>
                            <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ width: '50%', padding: '3%' }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%' }}> Last Name </Typography>
                            <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ width: '30%', padding: '3%' }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%' }}> Telephone Number </Typography>
                            <TextField value={telephoneNumber} onChange={(e) => setTelephoneNumber(e.target.value)} sx={{ width: '30%', padding: '3%' }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%' }}> Email Address </Typography>
                            <TextField value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} sx={{ width: '30%', padding: '3%' }} />
                        </div>
                        {props.edit &&
                            <div>
                                <div style={{ display: 'flex' }}>
                                    <Typography> Manager </Typography>
                                    <Autocomplete
                                        disablePortal
                                        options={props.manager}
                                        getOptionLabel={(options) => options.managerName}
                                        sx={{ width: 300, paddingLeft: '5%' }}
                                        renderInput={(params) => <TextField {...params} label="Select Manager" />}
                                        onChange={(e, value) => {
                                            if (value)
                                                setManager(value)
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Typography> Status </Typography>
                                    <Autocomplete
                                        disablePortal
                                        options={StatusOptions}
                                        value={getStatusValue()}
                                        sx={{ width: 300, paddingLeft: '5%' }}
                                        renderInput={(params) => <TextField {...params} variant='standard' label="Select Active/Inactive" />}
                                        onChange={(e, v) => {
                                            if (v === 'Active') {
                                                setStatus(true)
                                            }
                                            else {
                                                setStatus(false)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        <Button variant='outlined' color='inherit' sx={{ width: '25%', padding: '5%' }} onClick={() => {
                            if (props.edit) {
                                EditEmployeeDetails({ id: props.employeeData.id, firstName, lastName, telephoneNumber, emailAddress, status, role: props.employeeData.role })
                            }
                            else {
                                CreateEmployee({ firstName, lastName, telephoneNumber, emailAddress, status: false, role: 'Employee' })
                            }
                            props.exit()
                        }}>
                            save
                        </Button>
                        <Button variant='outlined' color='inherit' sx={{ width: '25%', padding: '5%', right: '-10%' }} onClick={() => props.exit()}>
                            cancel
                        </Button>
                    </Grid2>
                </Grid2>
            </div>
        </div>
    )
}

export default Employee_Edit_Create