"use client"
import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'
import EmployeeTable from './EmployeeTable'
import { api } from 'ernst_stephen_fischer/trpc/react'
import Employee_Edit_Create from '../Employee_Edit_Create'

interface Employees {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    status: boolean,
    role: string
}


const Employee_List = () => {
    const StatusOptions = ["Active", 'Inactive']
    const Department = ['A', 'B', 'C', 'D']
    const [create, setCreate] = useState(false)
    const [edit, setEdit] = useState(false)
    const [employeeData, setEmployeeData] = useState<Employees>()
    const employees = api.get.getEmployees.useQuery()
    // const addEmployees = () => {
    //     const createEmployee = api.insert.insertEmployees.useMutation()
    //     const employeesCreate = [{
    //         firstName: 'carl',
    //         lastName: 'Fisch',
    //         telephoneNumber: '061-366-9008',
    //         emailAddress: 'carl@gmail.com',
    //         status: false,
    //         role: 'Manager'
    //     },
    //     {
    //         firstName: 'nick',
    //         lastName: 'Fisch',
    //         telephoneNumber: '061-366-9003',
    //         emailAddress: 'nick@gmail.com',
    //         status: false,
    //         role: 'Employee'
    //     }
    //     ]
    //     if (!create) {
    //         for (let index = 0; index < employeesCreate.length; index++) {
    //             const element = employeesCreate[index];
    //             if (element)
    //                 createEmployee.mutate(element)
    //         }
    //         setCreate(true)
    //     }
    // }
    // if (!create) {
    //     addEmployees()
    // }

    if (edit && employeeData) {
        return (
            <div>
                <Employee_Edit_Create employeeData={employeeData} edit={true} cancel={() => setEdit(false)} />
            </div>
        )
    }
    if (create && employeeData) {
        return (
            <div>
                <Employee_Edit_Create employeeData={employeeData} edit={false} cancel={() => setCreate(false)} />
            </div>
        )
    }

    return (
        <div>
            {employees.data && <div> <div style={{ display: 'flex', paddingTop: '0.1vh', paddingLeft: '2%' }}>
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
                                <Divider color='white' />
                                <Button variant='text' onClick={() => setCreate(true)}> Add Employee</Button>
                            </Box>
                        </Grid2>
                        <Grid2 xs='auto' >
                            <Typography sx={{ paddingBottom: '2%' }}> Employees </Typography>
                            <Box
                                height={'30vh'}
                                width={'90vh'}
                                display="grid"
                                sx={{ border: '2px solid grey' }}>
                                <Typography> Filters </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={StatusOptions}
                                    sx={{ width: 300, paddingLeft: '5%' }}
                                    renderInput={(params) => <TextField {...params} label="Active/Inactive Status" />}
                                />
                                <Autocomplete
                                    disablePortal
                                    options={Department}
                                    sx={{ width: 300, paddingLeft: '5%' }}
                                    renderInput={(params) => <TextField {...params} label="select Department" />}
                                />
                                <Autocomplete
                                    disablePortal
                                    options={Department}
                                    sx={{ width: 300, paddingLeft: '5%' }}
                                    renderInput={(params) => <TextField {...params} label="select Status" />}
                                />
                                <Button variant='outlined' color='inherit' sx={{ width: '15%' }}>
                                    Filter
                                </Button>
                            </Box>
                        </Grid2>
                        <div style={{ width: '80%', display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingLeft: '15%' }}>
                            <EmployeeTable employeeData={employees.data} editEmployee={(data) => {
                                setEmployeeData(data)
                                setEdit(true)
                            }} />
                        </div>
                    </Grid2>
                </div>
            </div>
            }


        </div>
    )
}

export default Employee_List