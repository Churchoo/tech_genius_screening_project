'use client'
import React, { useState } from 'react'
import Login from '../Login'
import Employee_List from '../Employee_List'
import { api } from 'ernst_stephen_fischer/trpc/react'
import Department_List from '../Department_List'
import { getServerSession } from 'next-auth'

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

interface ManagerDepartmentLink {
    id: number,
    managerId: number,
    DepartmentId: number
}

interface ManagerEmployeesLink {
    id: number,
    managerId: number,
    EmployeeId: number
}

interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
}

const Navigation = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState<Employees>()
    const [viewEmployees, setViewEmployees] = useState(false)
    const [viewDepartment, setViewDepartment] = useState(false)
    const [getData, setGetData] = useState(false)
    const [employeeData, setEmployeeData] = useState<Employees[]>([])
    const [managerData, setManagerData] = useState<Manager[]>([])
    const [departmentData, setDepartmentData] = useState<Departments[]>([])
    const [departmentMangerLink, setDepartmentMangerLink] = useState<ManagerDepartmentLink[]>([])
    const [employeeMangerLink, setEmployeeMangerLink] = useState<ManagerEmployeesLink[]>([])
    const employees = api.get.getEmployees.useQuery().data
    const allDepartment = api.get.getDepartment.useQuery().data
    const allManagers = api.get.getAllManager.useQuery().data
    const managerEmployeesLink = api.get.getManagerEmployeesLink.useQuery().data
    const managerDepartmentLink = api.get.getDepartmentManagerLink.useQuery().data
    //this function saves the user data to check what permissions the user will have
    const setLoginData = (user: Employees) => {
        setUser(user)
        setLoggedIn(true)
        handleSeeEmployees()
    }
    // this checks that all the data has been collected from the database to make sure there are not too many calls to the database
    if (!getData && employees && allDepartment && allManagers && managerEmployeesLink && managerDepartmentLink) {
        setEmployeeData(employees.sort((a,b) => a.id > b.id ? 1 : -1))
        setManagerData(allManagers.sort((a,b) => a.id > b.id ? 1 : -1))
        setDepartmentData(allDepartment.sort((a,b) => a.id > b.id ? 1 : -1))
        setDepartmentMangerLink(managerDepartmentLink)
        setEmployeeMangerLink(managerEmployeesLink)
        setGetData(true)
    }
    
    const handleSeeEmployees = () => {
        setViewEmployees(!viewEmployees)
    }

    const handleSeeDepartment = () => {
        setViewDepartment(!viewDepartment)
    }

    const viewDepartmentPage = () => {
        handleSeeDepartment()
        handleSeeEmployees()
    }

    const viewEmployeesPage = () => {
        handleSeeDepartment()
        handleSeeEmployees()
    }
    
    if (!loggedIn) {
        return (
            <Login User={(userData: Employees) => setLoginData(userData)} />
        )
    }

    if (viewEmployees && getData && user) {
        return (
            <Employee_List
                user={user} employees={employeeData} allDepartment={departmentData} allManagers={managerData} addEmployeeData={(data) => setEmployeeData(data)}
                managerDepartmentLink={departmentMangerLink} managerEmployeesLink={employeeMangerLink} viewDepartment={() => viewDepartmentPage()} addemployeeManagerLink={(data) => setEmployeeMangerLink(data) } />
        )
    }

    if (viewDepartment && getData && user) {
        return (
            <Department_List addDepartment={(data) => setDepartmentData(data)} addDepartmentManagerLink={(data) => setDepartmentMangerLink(data)} departments={departmentData} managerDepartmentLink={departmentMangerLink} managers={managerData} user={user} viewEmployees={() => viewEmployeesPage()} />
        )
    }
    return (
        <div>loading</div>
    )
}

export default Navigation