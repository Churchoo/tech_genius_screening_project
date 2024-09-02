"use client"
import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'
import EmployeeTable from './EmployeeTable'
import Employee_Edit_Create from './Employee_Edit_Create'
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

interface EmployeesLink {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    password: string,
    status: boolean,
    role: string,
    managerId: number
}

interface Departments {
    id: number,
    name: string,
    status: boolean
}

interface ManagerDepartmentLink {
    id: number,
    managerId: number,
    DepartmentId: number
}

interface managerEmployeesLink {
    id: number,
    managerId: number,
    EmployeeId: number
}


interface tableEmployees {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    manager: Manager,
    password: string,
    status: boolean,
    role: string
}

interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
}

interface Props {
    user: Employees,
    employees: Employees[],
    allManagers: Manager[],
    allDepartment: Departments[],
    managerEmployeesLink: managerEmployeesLink[],
    managerDepartmentLink: ManagerDepartmentLink[],
    viewDepartment(): void
    addEmployeeData(data: Employees[]): void,
    addemployeeManagerLink(data: managerEmployeesLink[]): void
}

const Employee_List = (props: Props) => {
    const StatusOptions = ["Active", 'Inactive']
    const [create, setCreate] = useState(false)
    const [edit, setEdit] = useState(false)
    const [filter, setFilter] = useState(false)
    const [getData, setGetData] = useState(false)
    const [getTableData, setGetTableData] = useState(false)
    const [filterStatus, setFilterStatus] = useState<boolean>()
    const [filterDepartment, setFilterDepartment] = useState<Departments>()
    const [filterManager, setFilterManager] = useState<Manager>()
    const [editEmployeeData, setEditEmployeeData] = useState<tableEmployees>()
    const [employeeData, setEmployeeData] = useState<Employees[]>([])
    const [editedEmployeeData, setEditedEmployeeData] = useState<Employees[]>([])
    const [filteredData, setFilteredData] = useState<tableEmployees[]>([])
    const [filteredDataCheck, setFilteredDataCheck] = useState<tableEmployees[]>([])
    const [employeeTableData, setEmployeeTableData] = useState<tableEmployees[]>([])
    const [employeeManagerLink, setEmployeeManagerLink] = useState<managerEmployeesLink[]>(props.managerEmployeesLink)

    const updateEmplyeeStatus = api.update.updateEmployeeStatus.useMutation()

    const getSpecificEmployeeData = () => {
        setEmployeeData([props.user])
        if (props.user.role === 'Employee') {
            setGetData(true)
        }
        else if (props.user.role === 'Manager') {
            for (let index = 0; index < employeeManagerLink.length; index++) {
                const element = employeeManagerLink[index];
                if (element) {
                    if (element.managerId === props.user.id) {
                        const data = props.employees?.find((value) => value.id === element.EmployeeId)
                        if (data) {
                            const viewData = [...employeeData, data]
                            setEmployeeData(viewData)
                        }
                    }
                }
            }
            setGetData(true)
        }
        else if (props.employees) {
            setEmployeeData(props.employees)
            setGetData(true)
        }
    }
    if (!getData) {
        getSpecificEmployeeData()
    }

    //filters the employees according to filter options chosen
    const getStatusValue = () => {
        if (filterStatus)
            return "Active"
        return "Inactive"
    }
    //Creates the table data
    const TableData = () => {
        if (employeeData.length > 0) {
            const data = employeeData
            let viewData: tableEmployees[] = []
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element) {
                    if (element.role === "Manager") {
                        {
                            const newData: tableEmployees = {
                                id: element.id,
                                firstName: element.firstName,
                                lastName: element.lastName,
                                telephoneNumber: element.telephoneNumber,
                                emailAddress: element.emailAddress,
                                manager: {
                                    id: -1,
                                    managerName: "",
                                    emailAddress: ""
                                },
                                password: element.password,
                                status: element.status,
                                role: element.role
                            }
                            viewData.push(newData)
                        }
                    }
                    else {
                        const manager = props.managerEmployeesLink?.find((value) => value.EmployeeId === element.id)
                        if (manager) {
                            const findManager = props.allManagers.find((value) => value.id === manager.managerId)
                            if (findManager && element.role !== 'Manager') {
                                const newData: tableEmployees = {
                                    id: element.id,
                                    firstName: element.firstName,
                                    lastName: element.lastName,
                                    telephoneNumber: element.telephoneNumber,
                                    emailAddress: element.emailAddress,
                                    manager: findManager,
                                    password: element.password,
                                    status: element.status,
                                    role: element.role
                                }
                                viewData.push(newData)
                            }
                            else {
                                const newData: tableEmployees = {
                                    id: element.id,
                                    firstName: element.firstName,
                                    lastName: element.lastName,
                                    telephoneNumber: element.telephoneNumber,
                                    emailAddress: element.emailAddress,
                                    manager: {
                                        id: -1,
                                        managerName: "",
                                        emailAddress: ""
                                    },
                                    password: element.password,
                                    status: element.status,
                                    role: element.role
                                }
                                viewData.push(newData)
                            }
                        }
                        else {
                            const newData: tableEmployees = {
                                id: element.id,
                                firstName: element.firstName,
                                lastName: element.lastName,
                                telephoneNumber: element.telephoneNumber,
                                emailAddress: element.emailAddress,
                                manager: {
                                    id: -1,
                                    managerName: "",
                                    emailAddress: ""
                                },
                                password: element.password,
                                status: element.status,
                                role: element.role
                            }
                            viewData.push(newData)
                        }
                    }
                }
            }
            setEmployeeTableData(viewData)
            setGetTableData(true)
        }
    }

    const filterEmployees = () => {
        if (filterStatus !== undefined) {
            const filteredEmployees = employeeTableData.filter((value) => value.status === filterStatus)
            setFilteredData(filteredEmployees)
        }
        if (filterDepartment) {
            const filteredDepartmentManagementLink = props.managerDepartmentLink?.find((value) => value.DepartmentId === filterDepartment.id)
            if (filteredDepartmentManagementLink && props.allManagers) {
                const filteredManager = props.allManagers.find((value => value.id === filteredDepartmentManagementLink.managerId))
                if (filteredManager) {
                    const filteredEmployeeManagementLink = employeeManagerLink?.filter((value) => value.managerId === filterManager?.id)
                    if (filteredEmployeeManagementLink) {
                        let viewData: tableEmployees[] = []
                        for (let index = 0; index < filteredEmployeeManagementLink.length; index++) {
                            const element = filteredEmployeeManagementLink[index];
                            if (element) {
                                const filteredData = employeeTableData.find((value) => value.id === element.EmployeeId)
                                if (filteredData) {
                                    viewData.push(filteredData)
                                }
                            }
                        }
                        setFilteredData(viewData)
                    }
                }
            }
            setFilter(true)
        }
        if (filterManager) {
            const filteredEmployeeManagementLink = employeeManagerLink?.filter((value) => value.managerId === filterManager.id)
            if (filteredEmployeeManagementLink) {
                let viewData: tableEmployees[] = []
                for (let index = 0; index < filteredEmployeeManagementLink.length; index++) {
                    const element = filteredEmployeeManagementLink[index];
                    if (element) {
                        const filteredData = employeeTableData.find((value) => value.id === element.EmployeeId)
                        if (filteredData) {
                            viewData.push(filteredData)
                        }
                    }
                }
                setFilteredData(viewData)
                setFilter(true)
            }
        }
    }

    const addEmployeeData = async (data: Employees) => {
        const newData = employeeData
        if (!edit) {
            newData.push(data)
            props.addEmployeeData(newData)
            updateEmployeeData(newData)
        }
        else {
            const index = newData.findIndex(value => value.id === data.id)
            if (newData[index]) {
                const changedData = newData.filter(value => value.id !== data.id)
                changedData.splice(index, 0, data)
                updateEmployeeData(changedData)
                props.addEmployeeData(changedData)
                setEditedEmployeeData(changedData)
            }
        }
        setEdit(false)
        setCreate(false)
    }

    const updateEmployeeData = (data: Employees[]) => {
        setEmployeeData(data,)
    }
    const addemployeeManagerLink = (data: EmployeesLink) => {
        const link = employeeManagerLink
        link.push({ id: 100, EmployeeId: data.id, managerId: data.managerId })
        props.addemployeeManagerLink(link)
        setEmployeeManagerLink(link)
        addEmployeeData(data)
        setEdit(false)
    }

    const changeStatus = (id: number) => {
        const newData = employeeData.filter(value => value.id !== id)
        const index = employeeData.findIndex(value => value.id === id)
        const data = employeeData[index]
        if (data) {
            const employee: Employees = {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                telephoneNumber: data.telephoneNumber,
                emailAddress: data.emailAddress,
                password: data.password,
                role: data.role,
                status: !data.status
            }
            newData.splice(index, 0, employee)
            updateEmplyeeStatus.mutate({ id, status: !data.status })
            setEmployeeData(newData)
            props.addEmployeeData(newData)
            setEditedEmployeeData(newData)
            if (filter) {
                const filterIndex = filteredData.findIndex(value => value.id === data.id)
                const filterData = filteredData.filter(value => value.id !== data.id)
                if (filteredData[filterIndex]) {
                    const filterEmployee: tableEmployees = {
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        telephoneNumber: data.telephoneNumber,
                        emailAddress: data.emailAddress,
                        password: data.password,
                        role: data.role,
                        status: !data.status,
                        manager: filteredData[filterIndex].manager
                    }
                    filterData.splice(filterIndex, 0, filterEmployee)
                    setFilteredData(filterData)
                    setFilteredDataCheck(filterData)
                }
            }
        }
    }



    const Reset = () => {
        setFilteredData(employeeTableData)
        setFilter(false)
    }
    if (!getTableData) {
        TableData();
    }
    const compareArrays = (a: any, b: any) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };
    useEffect(() => {
        if (editedEmployeeData.length > 0) {
            if (compareArrays(editedEmployeeData, employeeData)) {
                if (compareArrays(filteredDataCheck, filteredData)) {  
                setGetTableData(false)
            }
            }
        }
    },
        [getTableData, editedEmployeeData, filteredDataCheck])

    if (edit && editEmployeeData) {
        return (
            <div>
                <Employee_Edit_Create employees={props.employees}
                    employeeData={editEmployeeData} edit={true} manager={props.allManagers}
                    addDataManager={(data: EmployeesLink) => addemployeeManagerLink(data)}
                    addData={(data: Employees) => addEmployeeData(data)} exit={() => setEdit(false)}
                    viewDepartment={() => {
                        setEdit(false)
                        setCreate(false)
                        props.viewDepartment()
                    }} />
            </div>
        )
    }
    if (create) {
        return (
            <div>
                <Employee_Edit_Create employeeData={({
                    id: 0,
                    firstName: "",
                    lastName: "",
                    telephoneNumber: "",
                    emailAddress: "",
                    password: "Password123#",
                    status: false,
                    role: "Employee",
                    manager: {
                        id: -1,
                        emailAddress: "",
                        managerName: ""
                    }
                })} edit={false} employees={props.employees} addData={(data: Employees) => addEmployeeData(data)}
                    addDataManager={(data: EmployeesLink) => addemployeeManagerLink(data)}
                    manager={[]} exit={() => setCreate(false)}
                    viewDepartment={() => {
                        setEdit(false)
                        setCreate(false)
                        props.viewDepartment()
                    }} />
            </div>
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
            <Typography variant='h4' sx={{ paddingLeft: '27vh' }}> Employee Details </Typography>
            <div style={{ display: 'flex', paddingTop: '0.2vh', paddingLeft: '2%' }}>
                <Grid2 container spacing={3} >
                    <div style={{ paddingTop: '4.5vh' }}>
                        <Box
                            height={'15vh'}
                            width={'30vh'}
                            display={'grid'}
                            alignItems={'center'}
                            sx={{ border: '2px solid grey' }}>
                            <Typography sx={{ paddingLeft: '38%', fontSize: 20 }}> Menu </Typography>
                            <Button variant='text' color='inherit' sx={{fontSize: 20}} onClick={() => props.viewDepartment()} disabled={props.user.role === 'Employee'}> View Departments</Button>
                            <Button variant='text' color='inherit' sx={{fontSize: 20}} onClick={() => setCreate(true)} disabled={props.user.role === 'Employee'}> Add Employee</Button>
                        </Box>
                    </div>
                    <Grid2 xs='auto' sx={{ paddingTop: '4.5vh' }} >
                        <Box
                            height={'40vh'}
                            width={'45vh'}
                            display={'grid'}
                            alignItems={'center'}
                            flex={'wrap'}
                            gap={1}
                            sx={{ border: '2px solid grey' }}
                        >
                             <Typography variant='h5'> Filters </Typography>
                            <Autocomplete
                                disabled={props.user.role === 'Employee'}
                                disablePortal
                                options={StatusOptions}
                                sx={{ width: '40vh', paddingLeft: '5%', paddingTop: '1%' }}
                                value={getStatusValue()}
                                onChange={(event, value) => {
                                    if (value === 'Active') {
                                        setFilterStatus(true)
                                    } else {
                                        setFilterStatus(false)
                                    }
                                }}
                                renderInput={(params) => <TextField {...params}
                                InputProps={{ ...params.InputProps, style: { fontSize: 22 } }} label="Active/Inactive Status" />}
                            />
                            <Autocomplete
                                disabled={props.user.role === 'Employee'}
                                disablePortal
                                options={props.allDepartment}
                                getOptionLabel={(value) => value.name}
                                sx={{ width: '40vh', paddingLeft: '5%', paddingTop: '1%' }}
                                value={filterDepartment}
                                onChange={(event, value) => {
                                    if (value) {
                                        setFilterDepartment(value)
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} 
                                InputProps={{ ...params.InputProps, style: { fontSize: 22 } }} label="select Department" />}
                            />
                            <Autocomplete
                                disabled={props.user.role === 'Employee'}
                                disablePortal
                                options={props.allManagers}
                                getOptionLabel={(value) => value.managerName}
                                sx={{ width: '40vh', paddingLeft: '5%', paddingTop: '1%' }}
                                value={filterManager}
                                onChange={(event, value) => {
                                    if (value) {
                                        setFilterManager(value)
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} 
                                InputProps={{ ...params.InputProps, style: { fontSize: 22 } }} label="select Manager" />}
                            />
                            <Grid2 container spacing={-1} justifyContent={'space-between'} sx={{ width: '60%', paddingLeft: '20%' }}>
                                <Button variant='outlined' color='inherit' sx={{ width: '15%' }} disabled={props.user.role === 'Employee'} onClick={() => filterEmployees()}>
                                    Filter
                                </Button>
                                <Button variant='outlined' color='inherit' sx={{ width: '15%' }} disabled={props.user.role === 'Employee'} onClick={() => Reset()}>
                                    Reset
                                </Button>
                            </Grid2>
                        </Box>
                    </Grid2>
                    <div style={{ width: '98%', display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingLeft: '10vh' }}>
                        {getTableData && <EmployeeTable changeStatus={(id) => changeStatus(id)} employeeData={filter ? filteredData : employeeTableData}
                            user={props.user} editEmployee={(data) => {
                                setEditEmployeeData(data)
                                setEdit(true)
                            }} />}
                    </div>
                </Grid2>
            </div>
        </div>
    )
}

export default Employee_List