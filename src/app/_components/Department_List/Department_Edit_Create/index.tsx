import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import { api } from 'ernst_stephen_fischer/trpc/react'
import React, { useState } from 'react'

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

interface Employees {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    password: string,
    status: boolean,
    role: string
}


interface Props {
    DepartmentData: DepartmentsTable,
    manager: Manager[],
    edit: boolean,
    addData(data: DepartmentsTable): void,
    user: Employees,
    exit(): void,
    viewDepartment(): void,
    viewEmployees(): void
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

    const getManager = () => {
        if (props.user.role === "Manager") {
            const data = props.manager.filter(value => value.emailAddress === props.user.emailAddress)
            if (data) {
                return data
            }
        }
        return props.manager
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
                    <Grid2 >
                        <Box
                            height={'11vh'}
                            width={'20vh'}
                            display={'grid'}
                            alignItems={'center'}
                            sx={{ border: '2px solid grey' }}>
                            <Typography sx={{ paddingLeft: '38%' }}> Menu </Typography>
                            <Button variant='text' color='inherit' onClick={() => props.viewDepartment()} > View Department</Button>
                            <Button variant='text' color='inherit' onClick={() => props.viewEmployees()} > View Employees</Button>
                        </Box>
                    </Grid2>
                    <Grid2>
                        <Typography sx={{ paddingBottom: '2%' }}> Create / Edit Employee </Typography>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%', paddingRight: '5vh' }}> Name </Typography>
                            <TextField value={departmentName} error={error && departmentName === ""} helperText={error && departmentName === "" ? "Enter Department Name" : ""} onChange={(e) => setDepartmentName(e.target.value)} sx={{ width: '32.7vh', padding: '3%' }} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', paddingTop: '2vh' }}>
                                <Typography sx={{ padding: '5%', paddingRight: '2.1vh' }}> Manager </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={getManager()}
                                    getOptionLabel={(options) => options.managerName}
                                    sx={{ width: 300, paddingLeft: '5%' }}
                                    value={manager}
                                    onChange={(e, value) => {
                                        if (value !== null)
                                            setManager(value)
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Select Manager" error={error && manager === undefined} />}

                                />
                            </div>
                            <div style={{ display: 'flex', paddingTop: '3vh' }}>
                                <Typography sx={{ padding: '5%', paddingRight: '3.9vh' }}> Status </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={StatusOptions}
                                    disabled={props.user.role !== "HRAdmin"}
                                    value={getStatusValue()}
                                    sx={{ width: 300, paddingLeft: '5%' }}
                                    renderInput={(params) => <TextField {...params} label="Select Active/Inactive" />}
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
                        <div style={{ paddingTop: '2vh' }}>
                            <Button variant='outlined' color='inherit' sx={{ width: '25%', padding: '5%' }} onClick={() => {
                                checkData()
                            }}>
                                save
                            </Button>
                            <Button variant='outlined' color='inherit' sx={{ width: '25%', padding: '5%', right: '-10%' }} onClick={() => props.exit()}>
                                cancel
                            </Button>
                        </div>
                    </Grid2>
                </Grid2>
            </div>
        </div>
    )
}

export default Department_Edit_Create