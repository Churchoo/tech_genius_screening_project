import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'
import EmployeeTable from '../Employee_List/EmployeeTable'
import Department_Table from './Department_Table'
import Department_Edit_Create from './Department_Edit_Create'
import { api } from 'ernst_stephen_fischer/trpc/react'

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

interface ManagerDepartmentLink {
    id: number,
    managerId: number,
    DepartmentId: number
}

interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
}


interface Props {
    user: Employees
    departments: Departments[],
    managerDepartmentLink: ManagerDepartmentLink[],
    managers: Manager[],
    viewEmployees(): void,
    addDepartment(data: Departments[]): void,
    addDepartmentManagerLink(data: ManagerDepartmentLink[]): void
}


const Department_List = (props: Props) => {
    const StatusOptions = ["Active", 'Inactive']
    const [departmentData, setDepartmentData] = useState<Departments[]>([])
    const [changedData, setChangedData] = useState<Departments[]>([])
    const [editData, setEditData] = useState<DepartmentsTable>()
    const [filtereStatus, setFilterStatus] = useState<boolean>()
    const [departmentFilter, setDepartmentFilter] = useState<boolean>()
    const [tableData, setTableData] = useState<DepartmentsTable[]>([])
    const [tableFilteredData, setTableFilteredData] = useState<DepartmentsTable[]>([])
    const [getTableData, setGetTableData] = useState(false)
    const [editDepartment, setEditDepartment] = useState(false)
    const [createDepartment, setCreateDepartment] = useState(false)
    const [getData, setGetData] = useState(false)

    const updateDepartmentStatus = api.update.updateDepartmentStatus.useMutation()
    // this gets all the departments the manager is in charge of
    const getSpecificDepartmentsData = () => {
        if (props.user.role === 'Manager') {
            const manager = props.managers.find((value) => value.emailAddress === props.user.emailAddress)
            const viewData: Departments[] = []
            for (let index = 0; index < props.managerDepartmentLink.length; index++) {
                const element = props.managerDepartmentLink[index];
                if (element && manager) {
                    if (element.managerId === manager.id) {
                        const data = props.departments?.find((value) => value.id === element.DepartmentId)
                        if (data) {
                            viewData.push(data)
                        }
                    }
                }
            }
            setDepartmentData(viewData)
            setGetData(true)
        }
        else if (props.departments) {
            setDepartmentData(props.departments)
            setGetData(true)
        }
    }
    if (!getData) {
        getSpecificDepartmentsData()
    }

    // this creates the data needed for the table
    const createDepartmentTableData = () => {
        if (departmentData.length > 0) {
            if (props.user.role === "Manager") {
                const manager = props.managers.find((value) => value.emailAddress === props.user.emailAddress)
                if (manager) {
                    const Links = props.managerDepartmentLink.filter((value) => value.managerId === manager.id)
                    if (Links) {
                        const viewData: DepartmentsTable[] = []
                        for (let index = 0; index < Links.length; index++) {
                            const element = Links[index];
                            if (element) {
                                const data = departmentData.find((value) => value.id === element.DepartmentId)
                                if (data) {
                                    const alteredData: DepartmentsTable = {
                                        id: element.DepartmentId,
                                        name: data.name,
                                        manager: manager,
                                        status: data.status
                                    }
                                    viewData.push(alteredData)
                                }
                            }
                        }
                        setTableData(viewData)
                        setGetTableData(true)
                    }
                }
            }
            else {
                const viewData: DepartmentsTable[] = []
                for (let index = 0; index < props.managerDepartmentLink.length; index++) {
                    const element = props.managerDepartmentLink[index];
                    if (element) {
                        const data = departmentData.find((value) => value.id === element.DepartmentId)
                        const managerData = props.managers.find((value) => value.id === element.managerId)
                        if (data && managerData) {
                            const alteredData: DepartmentsTable = {
                                id: element.DepartmentId,
                                name: data.name,
                                manager: managerData,
                                status: data.status
                            }
                            viewData.push(alteredData)
                        }
                    }
                }
                setTableData(viewData)
                setGetTableData(true)
            }
        }
    }

    if (!getTableData) {
        createDepartmentTableData()
    }

    const exit = () => {
        setEditDepartment(false)
        setCreateDepartment(false)
    }
    //this filters the information on the table
    const getFilteredInformation = () => {
        const data = tableData
        if (filtereStatus !== undefined) {
            const filteredData = data.filter(value => value.status === filtereStatus)
            if (filteredData) {
                setTableFilteredData(filteredData)
            }
        }
        setDepartmentFilter(true)
    }
    //setup the data needed to edit a department
    const editDepartmentSetup = (data: DepartmentsTable) => {
        setEditData(data)
        setEditDepartment(true)
    }


    //this add/edits the department that has been created or edited on that page
    const addDepartment = (data: DepartmentsTable) => {
        if (createDepartment) {
            const newDepartmentData = tableData
            newDepartmentData.push(data)
            const ManagerDepartmentLink = props.managerDepartmentLink
            ManagerDepartmentLink.push({ id: 999, DepartmentId: data.id, managerId: data.manager.id })
            props.addDepartmentManagerLink(ManagerDepartmentLink)
            setTableData(newDepartmentData)
            setChangedData(newDepartmentData)
            props.addDepartment(newDepartmentData)
        } else {
            const newDepartmentData = tableData.filter(value => value.id !== data.id)
            const index = tableData.findIndex(value => value.id === data.id)
            const department: DepartmentsTable = {
                id: data.id,
                name: data.name,
                status: data.status,
                manager: data.manager
            }
            newDepartmentData.splice(index, 0, department)
            setTableData(newDepartmentData)
            setChangedData(newDepartmentData)
            const ManagerDepartmentLink = props.managerDepartmentLink
            ManagerDepartmentLink.push({ id: 999, DepartmentId: data.id, managerId: data.manager.id })
            props.addDepartmentManagerLink(ManagerDepartmentLink)
            props.addDepartment(newDepartmentData)
        }
        setEditDepartment(false)
        setCreateDepartment(false)
    }

    //This changes the status when the button is selected on the table
    const changeStatus = (data: DepartmentsTable) => {
        const newData = departmentData.filter(value => value.id !== data.id)
        const index = departmentData.findIndex(value => value.id === data.id)
        updateDepartmentStatus.mutate({ id: data.id, status: !data.status })
        const department: Departments = {
            id: data.id,
            name: data.name,
            status: !data.status,
        }
        newData.splice(index, 0, department)
        setDepartmentData(newData)
        setChangedData(newData)
    }

    const compareArrays = (a: Departments[], b: Departments[]) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    const Reset = () => {
        setDepartmentFilter(false)
    }

    useEffect(() => {
        if (changedData.length > 0) {
            if (compareArrays(changedData, departmentData)) {
                setGetTableData(false)
            }
        }

    },
        [getTableData, changedData])

    //addData={(data) => addDepartment(data)}
    if (editData && editDepartment) {
        return (
            <Department_Edit_Create viewDepartment={() => {
                setEditDepartment(false)
                setCreateDepartment(false)
            }} viewEmployees={() => {
                setEditDepartment(false)
                setCreateDepartment(false)
                props.viewEmployees()
            }} DepartmentData={editData} user={props.user} edit={editDepartment} manager={props.managers} addData={(data) => addDepartment(data)} exit={() => exit()} />
        )
    }
    if (createDepartment) {
        return (
            <Department_Edit_Create viewDepartment={() => {
                setEditDepartment(false)
                setCreateDepartment(false)
            }} viewEmployees={() => {
                setEditDepartment(false)
                setCreateDepartment(false)
                props.viewEmployees()
            }} DepartmentData={({ id: 0, manager: { id: 0, emailAddress: "", managerName: "" }, name: "", status: false })}
                user={props.user} addData={(data) => addDepartment(data)} edit={editDepartment} exit={() => exit()} manager={props.managers} />
        )
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
            <Typography variant='h4' sx={{ paddingLeft: '38vh' }}> Departments </Typography>
            <div style={{ display: 'flex', paddingTop: '0.1vh', paddingLeft: '2%' }}>
                <Grid2 container spacing={3} >
                    <div style={{ paddingTop: '1.4vh' }}>
                        <Box
                            height={'15vh'}
                            width={'30vh'}
                            display={'grid'}
                            alignItems={'center'}
                            sx={{ border: '2px solid grey' }}>
                            <Typography sx={{ paddingLeft: '38%', fontSize: 20 }}> Menu </Typography>
                            <Button variant='text' color='inherit' sx={{ fontSize: 20 }} onClick={() => setCreateDepartment(true)} > Add Department</Button>
                            <Button variant='text' color='inherit' sx={{ fontSize: 20 }} onClick={() => props.viewEmployees()} disabled={props.user.role === 'Employee'}> View Employees</Button>
                        </Box>
                    </div>
                    <div style={{ display: 'flex', paddingTop: '0.2vh', paddingLeft: '2%' }}>
                        <Grid2 xs='auto' >
                            <Box
                                height={'20vh'}
                                width={'40vh'}
                                display="grid"
                                sx={{ border: '2px solid grey' }}>
                                <Typography variant='h5'> Filters </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={StatusOptions}
                                    sx={{ width: '30vh', paddingLeft: '8vh' }}
                                    onChange={(event, value) => {
                                        if (value === "Active") {
                                            setFilterStatus(true)
                                        }
                                        else {
                                            setFilterStatus(false)
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params}
                                    InputProps={{ ...params.InputProps, style: { fontSize: 22 } }} label="Active/Inactive Status" />}
                                />
                                <Grid2 container spacing={-1} justifyContent={'space-between'} sx={{ width: '60%', height: '5vh', paddingLeft: '20%' }}>
                                    <Button variant='outlined' color='inherit' sx={{ width: '15%' }} disabled={props.user.role === 'Employee'} onClick={() => getFilteredInformation()}>
                                        Filter
                                    </Button>
                                    <Button variant='outlined' color='inherit' sx={{ width: '15%' }} disabled={props.user.role === 'Employee'} onClick={() => Reset()}>
                                        Reset
                                    </Button>
                                </Grid2>
                            </Box>
                        </Grid2>
                    </div>
                    <div style={{ width: '130vh', display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingLeft: '21vh' }}>
                        <Department_Table changeStatus={(id) => changeStatus(id)} departmentData={departmentFilter ? tableFilteredData : tableData} editDepartment={(data) => editDepartmentSetup(data)} />
                    </div>
                </Grid2>
            </div>
        </div>
    )
}

export default Department_List