"use client"
import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import { api } from 'ernst_stephen_fischer/trpc/react';


const Login = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const addUser = api.insert.insertUser.useMutation()
    const LoginUser = () => {
        addUser.mutate({name: 'Stephen'})
    }
    const hello = api.post.hello.useQuery({text: 'stephen'})

    
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '18vh' }}>
            <Box
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
            >
                <p>{hello.data?.greeting}</p>
                <Typography variant='h4' >Login </Typography>
                <Typography  sx={{ textAlign:'left' }} >User name </Typography>
                <TextField required value={userName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} sx={{ width: "80%" }} />
                <Typography >Password </Typography>
                <TextField required type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} sx={{ width: "80%" }} />
                <Button variant='outlined' color='inherit' onClick={() => LoginUser()}>
                    Login
                </Button>
            </Box>
        </div>
    )
}

export default Login