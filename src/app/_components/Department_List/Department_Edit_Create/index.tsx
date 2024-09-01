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

interface Departments {
    id: number,
    name: string,
    status: boolean
}

interface DepartmentsTable {
    id: number,
    name: string,
    status: boolean,
    manager: Manager
}

interface EditDepartments {
    id: number,
    name: string,
    status: boolean,
    managerId: number
}

interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
}

interface CreateDepartment {
    name: string,
    status: boolean,
    manager: Manager
}

interface Props {
    DepartmentData: DepartmentsTable,
    manager: Manager[],
    edit: boolean,
    addData(data: DepartmentsTable): void,
    exit(): void
}
const Department_Edit_Create = (props: Props) => {
    const StatusOptions = ["Active", 'Inactive']
    const [departmentName, setDepartmentName] = useState(props.DepartmentData.name)
    const [manager, setManager] = useState<Manager>(props.DepartmentData.manager)
    const [status, setStatus] = useState(props.DepartmentData.status)
    const [error, setError] = useState(false)

    const updateDepartment = api.update.updateDepartment.useMutation()
    const createDepartment = api.insert.insertDepartment.useMutation()
    const createDepartmentManagerLink = api.insert.insertManagerDepartmentLink.useMutation()
    const ManagerEdit = api.update.updateManager.useMutation()
    const updateDepartmentManagerLink = api.update.updateDepartmentManagerLink.useMutation()
    const EditDepartmentDetails = (data: EditDepartments) => {
        updateDepartment.mutate({ id: data.id, name: data.name, status: data.status })
        updateDepartmentManagerLink.mutate({ departmentId: data.id, managerId: data.managerId })
    }
    const CreateDepartment = (data: CreateDepartment) => {
        createDepartment.mutate({ name: data.name, status: data.status })
        const newDepartment = createDepartment.data
        if (newDepartment && newDepartment !== null) {
            createDepartmentManagerLink.mutate({ managerId: data.manager.id, departmentId: newDepartment.id })
        }
    }

    const getStatusValue = () => {
        if (status)
            return "Active"
        return "Inactive"
    }

    const checkData = () => {
        if (departmentName === "" || manager.id < 0 || status === undefined) {
            setError(true)
        }
        else if (props.edit) {
            EditDepartmentDetails({ id: props.DepartmentData.id, name: departmentName, status: status, managerId: manager.id })
        }
        else {
            CreateDepartment({ manager: manager, name: departmentName, status: status })
            props.addData
        }
    }
    return (
        <div>
            <div style={{ display: 'flex', paddingTop: '0.1vh', paddingLeft: '2%' }}>
                <Box
                    component="form"
                    height={'5vh'}
                    width={'90%'}
                    my={4}
                    display="flex"
                    flexDirection='column'
                    justifyContent='center'
                    p={2}
                    sx={{ border: '2px solid grey', alignSelf: 'center' }}
                    autoComplete='off'
                >
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
                            <Typography sx={{ padding: '5%' }}> Name </Typography>
                            <TextField value={departmentName} error={error&&departmentName===""} helperText={error && departmentName==="" ? "Enter Department Name" : ""} onChange={(e) => setDepartmentName(e.target.value)} sx={{ width: '50%', padding: '3%' }} />
                        </div>
                        <div>
                            <div style={{ display: 'flex' }}>
                                <Typography> Manager </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={props.manager}
                                    getOptionLabel={(options) => options.managerName}
                                    sx={{ width: 300, paddingLeft: '5%' }}
                                    renderInput={(params) => <TextField {...params} label="Select Manager" error={error&&manager===undefined}/>}
                                    value={manager}
                                    onChange={(e, value) => {
                                        if (value !== null)
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
                        <Button variant='outlined' color='inherit' sx={{ width: '25%', padding: '5%' }} onClick={() => {
                            checkData()
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

export default Department_Edit_Create