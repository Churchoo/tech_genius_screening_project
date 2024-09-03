import { Autocomplete, Box, Button, Divider, FormControl, Input, InputLabel, TextField, Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import { IMaskInput } from 'react-imask';
import { api } from 'ernst_stephen_fischer/trpc/react'
import React, { useState } from 'react'

interface Employee {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    password: string,
    status: boolean,
    role: string
}

interface EmployeeManager {
    id: number,
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    password: string,
    status: boolean,
    role: string,
    manager: Manager
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

interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
}

interface Props {
    employeeData: EmployeeManager,
    employees: Employee[]
    manager: Manager[],
    edit: boolean,
    addData(data: Employee): void,
    addDataManager(data: EmployeesLink): void,
    viewDepartment(): void,
    exit(): void
    user: Employee
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="+2700 000-0000"
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);

const Employee_Edit_Create = (props: Props) => {
    const StatusOptions = ["Active", 'Inactive']
    const [firstName, setFirstName] = useState(props.employeeData.firstName)
    const [lastName, setLastName] = useState(props.employeeData.lastName)
    const [telephoneNumber, setTelephoneNumber] = useState(props.employeeData.telephoneNumber)
    const [emailAddress, setEmailAddress] = useState(props.employeeData.emailAddress)
    const [error, setError] = useState(false)
    const [manager, setManager] = useState<Manager>(props.employeeData.manager)
    const [status, setStatus] = useState(props.employeeData.status)
    const getStatusValue = () => {
        if (status) {
            return "Active"
        }
        return "Inactive"
    }

    const updateEmployee = api.update.updateEmployees.useMutation()
    const createEmployee = api.insert.insertEmployees.useMutation()
    const EmployeeManagerLink = api.update.updateEmployeeManagerLink.useMutation()
    const ManagerEdit = api.update.updateManager.useMutation()

    const getId = () => {
        if (props.edit) {
            return props.employeeData.id
        }
        else {
            return props.employees.length
        }
    }

    const validateEmail = (mail: string) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
         {
           return true
         }
           return false
       }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTelephoneNumber(
            event.target.value,
        );
    };
    //this function checks that all the required data has in put in to create an employee
    const checkData = (data: Employee) => {
        console.log(validateEmail(emailAddress))
        if (data.firstName === "" || data.lastName === "" || data.telephoneNumber === "" || data.emailAddress === "" || !validateEmail(emailAddress)) {
            setError(true)
        } else {
            if (props.edit) {
                EditEmployeeDetails({ id: data.id, firstName, lastName, telephoneNumber, emailAddress, status, role: props.employeeData.role, password: "Password123#" })
            }
            else {
                CreateEmployee({ id: data.id, firstName, lastName, telephoneNumber, emailAddress, status: false, role: 'Employee', password: "Password123#" })
            }
        }
    }
    //this updates data in the database
    const EditEmployeeDetails = (data: Employee) => {
        if (data.role === 'Manager') {
            ManagerEdit.mutate({ managerName: data.firstName + " " + data.lastName, oldEmail: props.employeeData.emailAddress, newEmail: data.emailAddress })
        }
        updateEmployee.mutate(data)
        if (manager) {
            EmployeeManagerLink.mutate({ EmployeeId: props.employeeData.id, managerId: manager.id })
            props.addDataManager({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                telephoneNumber: data.telephoneNumber,
                emailAddress: data.emailAddress,
                password: "Password123#",
                status: data.status,
                role: data.role,
                managerId: manager.id
            })
        }
        props.addData(data)
    }
    //this insterts data into the database
    const CreateEmployee = (data: Employee) => {
        createEmployee.mutate({ firstName: data.firstName, lastName: data.lastName, telephoneNumber: data.telephoneNumber, emailAddress: data.emailAddress, password: "Password123#", status: data.status, role: "Employee" })
        props.addData({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            telephoneNumber: data.telephoneNumber,
            emailAddress: data.emailAddress,
            status: data.status,
            role: data.role,
            password: "Password123#"
        })
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
                        <div>
                            <Box
                                height={'11vh'}
                                width={'20vh'}
                                display={'grid'}
                                alignItems={'center'}
                                sx={{ border: '2px solid grey' }}>
                                <Typography sx={{ paddingLeft: '38%' }}> Menu </Typography>
                                <Button variant='text' color='inherit' onClick={() => props.viewDepartment()}> View Departments</Button>
                                <Button variant='text' color='inherit' onClick={() => props.exit()}> View Employee</Button>
                            </Box>
                        </div>
                    </Grid2>
                    <Grid2 sx={{ width: '70vh' }}>
                        <Typography variant='h4' sx={{ paddingBottom: '1%' }}> Create / Edit Employee </Typography>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%', paddingRight: '10vh' }} variant='h6'> First Name </Typography>
                            <TextField value={firstName} error={error && firstName === ""} helperText={error && firstName === "" ? "Enter First Name" : ""}
                                onChange={(e) => setFirstName(e.target.value)} sx={{ width: '50%', padding: '3%', fontSize: 22 }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%', paddingRight: '10vh' }} variant='h6'> Last Name </Typography>
                            <TextField value={lastName} error={error && lastName === ""} helperText={error && lastName === "" ? "Enter Last Name" : ""}
                                onChange={(e) => setLastName(e.target.value)} sx={{ width: '50%', padding: '3%', fontSize: 22 }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%', paddingRight: '2.5vh' }} variant='h6'> Telephone Number </Typography>
                            <FormControl variant="standard" sx={{paddingTop: '4vh', paddingLeft: '2.3vh'}}>
                                <Input
                                    value={telephoneNumber}
                                    onChange={handleChange}
                                    name="textmask"
                                    inputComponent={TextMaskCustom as any}
                                />
                            </FormControl>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Typography sx={{ padding: '5%', paddingRight: '6.7vh' }} variant='h6'> Email Address </Typography>
                            <TextField value={emailAddress} error={error && (emailAddress === "" || !validateEmail(emailAddress))}
                                helperText={error && firstName === "" ? "Enter Email Address" : ""}
                                onChange={(e) => setEmailAddress(e.target.value)} sx={{ width: '50%', padding: '3%', fontSize: 22 }} />
                        </div>
                        {props.edit &&
                            <div>
                                <div style={{ display: 'flex', paddingLeft: '5%', paddingTop: '2vh' }}>
                                    <Typography variant='h6'> Manager </Typography>
                                    <Autocomplete
                                        disablePortal
                                        options={props.manager}
                                        disabled={props.user.role !== "HRAdmin"}
                                        getOptionLabel={(options) => options.managerName}
                                        value={manager}
                                        sx={{ width: '40vh', paddingLeft: '13.7vh' }}
                                        renderInput={(params) => <TextField {...params}
                                            InputProps={{ ...params.InputProps, style: { fontSize: 22 } }} label="Select Manager" />}
                                        onChange={(e, value) => {
                                            if (value)
                                                setManager(value)
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', paddingLeft: '5%', paddingTop: '4vh' }}>
                                    <Typography variant='h6'> Status </Typography>
                                    <Autocomplete
                                        disablePortal
                                        options={StatusOptions}
                                        disabled={props.user.role !== "HRAdmin"}
                                        value={getStatusValue()}
                                        sx={{ width: '42vh', paddingLeft: '16vh' }}
                                        renderInput={(params) => <TextField {...params} InputProps={{ ...params.InputProps, style: { fontSize: 22 } }} label="Select Active/Inactive" />}
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
                        <div style={{ paddingTop: '2vh' }}>
                            <Button variant='outlined' color='inherit' sx={{ width: '25%', padding: '5%' }} onClick={() => {
                                checkData({ id: getId(), firstName, lastName, telephoneNumber, emailAddress, status, role: props.employeeData.role, password: "Password123#" })
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

export default Employee_Edit_Create