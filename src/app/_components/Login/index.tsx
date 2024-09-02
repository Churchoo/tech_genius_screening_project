"use client"
import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import { api } from 'ernst_stephen_fischer/trpc/react';

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
    User(user: Employees): void
}

const Login = (props: Props) => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [add, setAdd] = useState(false)
    const employee = api.get.getEmployees.useQuery().data
    //this function checks the login details and logs the user in if the details are correct.
    const LoggingIn = () => {
        const index = employee?.findIndex((value) => value.emailAddress === userName && value.password === password)
        if (userName === "hradmin@test.com" && password === "TestPass1234") {
            props.User({ id: 0, firstName: '', lastName: '', telephoneNumber: '', emailAddress: '', password: '', status: false, role: 'HRAdmin' })
        }
        else if (index !== undefined && employee !== undefined) {
            const element = employee[index]
            if (element) {
                props.User(element)
            } else {
                setError(true)
            }
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '18vh' }}>
            <Box
                component="form"
                height={'50vh'}
                width={'50%'}
                my={4}
                display="flex"
                flexDirection='column'
                alignItems="center"
                justifyContent='center'
                gap={4}
                p={2}
                sx={{ border: '2px solid grey', alignSelf: 'center' }}
                autoComplete='off'
            >
                <Typography variant='h3' >Login </Typography>
                <Typography sx={{ textAlign: 'left' }} variant='h5' >User name </Typography>
                <TextField required error={error} value={userName} helperText={error ? "incorrect login details" : ""} label="Username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserName(e.target.value)
                    setError(false)
                }} sx={{ width: "80%" }}
                    inputProps={{ style: { fontSize: 24 } }}
                    InputLabelProps={{ style: { fontSize: 26 } }} />
                <Typography variant='h5' >Password </Typography>
                <TextField required error={error} helperText={error ? "incorrect login details" : ""} type='password' value={password} label="Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value)
                    setError(false)
                }
                } sx={{ width: "80%" }}
                    inputProps={{ style: { fontSize: 24 } }}
                    InputLabelProps={{ style: { fontSize: 26 } }} />
                <Button variant='outlined' color='inherit' onClick={() => LoggingIn()}>
                    Login
                </Button>
            </Box>
        </div>
    )
}

export default Login