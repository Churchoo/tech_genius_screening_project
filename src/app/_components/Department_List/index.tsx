import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'
import EmployeeTable from '../Employee_List/EmployeeTable'
import Department_Table from './Department_Table'
import Department_Edit_Create from './Department_Edit_Create'

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
    const [departmentData, setDepartmentData] = useState<DepartmentsTable[]>([])
    const [unfilteredData, setUnfilteredData] = useState<DepartmentsTable[]>([])
    const [editData, setEditData] = useState<DepartmentsTable>()
    const [filtereStatus, setFilterStatus] = useState<boolean>()
    const [getTableData, setGetTableData] = useState(false)
    const [editDepartment, setEditDepartment] = useState(false)
    const [createDepartment, setCreateDepartment] = useState(false)
    const createDepartmentTableData = () => {
        if (props.user.role === "Manager") {
            const manager = props.managers.find((value) => value.emailAddress === props.user.emailAddress)
            if (manager) {
                const Links = props.managerDepartmentLink.filter((value) => value.managerId === manager.id)
                if (Links) {
                    const viewData: DepartmentsTable[] = []
                    for (let index = 0; index < Links.length; index++) {
                        const element = Links[index];
                        if (element) {
                            const departmentData = props.departments.find((value) => value.id === element.DepartmentId)
                            if (departmentData) {
                                const data: DepartmentsTable = {
                                    id: element.DepartmentId,
                                    name: departmentData.name,
                                    manager: manager,
                                    status: departmentData.status
                                }
                                viewData.push(data)
                            }
                        }
                    }
                    setUnfilteredData(viewData)
                    setDepartmentData(viewData)
                    setGetTableData(true)
                }
            }
        }
        else{
            const viewData: DepartmentsTable[] = []
            for (let index = 0; index < props.managerDepartmentLink.length; index++) {
                const element = props.managerDepartmentLink[index];
                if(element){
                    const departmentData = props.departments.find((value) => value.id === element.DepartmentId)
                    const managerData = props.managers.find((value) => value.id === element.managerId)
                    if(departmentData&&managerData){
                        const data: DepartmentsTable = {
                            id: element.DepartmentId,
                            name: departmentData.name,
                            manager: managerData,
                            status: departmentData.status
                        }
                        viewData.push(data)
                    }
                }
            }
            setUnfilteredData(viewData)
            setDepartmentData(viewData)
            setGetTableData(true)
        }
    }

    if(!getTableData){
        createDepartmentTableData()
    }

    const exit = () => {
        setEditDepartment(false)
        setCreateDepartment(false)
    }

    const getFilteredInformation = () => {
        const data = unfilteredData
        if(filtereStatus!==undefined){
            const filteredData = data.filter(value => value.status===filtereStatus)
            if(filteredData){
                setDepartmentData(filteredData)
            }
        }
    }

    const editDepartmentSetup = (data: DepartmentsTable) => {
        setEditData(data)
        setEditDepartment(true)
    }

    const addDepartment=(data: DepartmentsTable)=>{
        const oldDepartmentData = unfilteredData
        oldDepartmentData.push(data)
        setUnfilteredData(oldDepartmentData)
        props.addDepartment(oldDepartmentData)
        const OldManagerDepartmentLink = props.managerDepartmentLink
        OldManagerDepartmentLink.push({id:999, DepartmentId: data.id, managerId: data.manager.id})
        props.addDepartmentManagerLink(OldManagerDepartmentLink)
    }

    
//addData={(data) => addDepartment(data)}
    if(editData&&editDepartment){
        return(
            <Department_Edit_Create DepartmentData={editData} edit={editDepartment} manager={props.managers} addData={(data) => addDepartment(data)} exit={() => exit()} />
        )
    }
    if(createDepartment){
        return(
            <Department_Edit_Create DepartmentData={({id: 0, manager: {id: 0, emailAddress: "", managerName: ""}, name: "", status: false})} addData={(data) => addDepartment(data)} edit={editDepartment} exit={()=>exit()} manager={props.managers} />
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
                            <Button variant='text' > Add Department</Button>
                            <Button variant='text' onClick={() => props.viewEmployees()} disabled={props.user.role === 'Employee'}> View Employees</Button>
                        </Box>
                    </Grid2>
                    <Grid2 xs='auto' >
                        <Typography sx={{ paddingBottom: '2%' }}> Departments </Typography>
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
                                onChange={(event, value) => {
                                    if(value==="Active"){
                                        setFilterStatus(true)
                                    }
                                    else{
                                        setFilterStatus(false)
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Active/Inactive Status" />}
                            />
                            <Button variant='outlined' color='inherit' sx={{ width: '15%' }} disabled={props.user.role === 'Employee'} onClick={() => getFilteredInformation()}>
                                Filter
                            </Button>
                        </Box>
                    </Grid2>
                    <div style={{ width: '80%', display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingLeft: '15%' }}>
                        <Department_Table departmentData={departmentData } editDepartment={(data) => editDepartmentSetup(data)} />
                        </div>
                </Grid2>
            </div>
        </div>
)
}

export default Department_List