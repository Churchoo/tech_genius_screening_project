"use client"
import { api } from 'ernst_stephen_fischer/trpc/react'
import React, { useState } from 'react'

interface CreateEmployee {
    firstName: string,
    lastName: string,
    telephoneNumber: string,
    emailAddress: string,
    password: string,
    status: boolean,
    role: string
}

interface Departments {
    name: string,
    status: boolean
}

interface ManagerDepartment {
    managerId: number,
    DepartmentId: number
}

export function AddEmployee() {
    const createEMLink = api.insert.insertManagerEmployeeLink.useMutation()
    // const [employeeData, setEmployeeData] = useState<any>()
    // const getEmployeeInfo = async () => {
    //     const employees = await api.get.getEmployees.useQuery().data
    //     setEmployeeData(employees)
    // }
    const createDepartment = api.insert.insertDepartment.useMutation()
    const createEmployee = api.insert.insertEmployees.useMutation()
    const createManager = api.insert.insertManager.useMutation()
    const createEmployeeManagerLink = api.insert.insertManagerEmployeeLink.useMutation()
    const createDepartmentManagerLink = api.insert.insertManagerDepartmentLink.useMutation()
    const employeeData: CreateEmployee[] = [
        {
            firstName: "Steven",
            lastName: "Johnson",
            telephoneNumber: '+2712-345-6789',
            emailAddress: 'stevejohnson@gmail.com',
            password: "Password123#",
            status: true,
            role: 'Manager'
        },
        {
            firstName: "Jack",
            lastName: "Johnson",
            telephoneNumber: '+2712-345-6789',
            emailAddress: 'jackjohnson@gmail.com',
            password: "Password123#",
            status: true,
            role: 'Employee'
        },
        {
            firstName: "Steward",
            lastName: "Jack",
            telephoneNumber: '+2712-479-9876',
            emailAddress: 'stewardjack@gmail.com',
            password: "Password123#",
            status: false,
            role: 'Manager'
        },
        {
            firstName: "Steven",
            lastName: "Jack",
            telephoneNumber: '+2712-497-9876',
            emailAddress: 'stevenjack@gmail.com',
            password: "Password123#",
            status: true,
            role: 'Employee'
        },
        {
            firstName: "Peter",
            lastName: "Rock",
            telephoneNumber: '+2712-842-9876',
            emailAddress: 'peterrock@gmail.com',
            password: "Password123#",
            status: false,
            role: 'Employee'
        },
        {
            firstName: "Jacky",
            lastName: "Chan",
            telephoneNumber: '+2712-986-9876',
            emailAddress: 'realjackychan@gmail.com',
            password: "Password123#",
            status: false,
            role: 'Employee'
        },
        {
            firstName: "Steven",
            lastName: "Jackson",
            telephoneNumber: '+2712-345-6789',
            emailAddress: 'stevejackson@gmail.com',
            password: "Password123#",
            status: true,
            role: 'Manager'
        },
        {
            firstName: "Jack",
            lastName: "Jackson",
            telephoneNumber: '+2712-345-6789',
            emailAddress: 'jackjackson@gmail.com',
            password: "Password123#",
            status: true,
            role: 'Employee'
        },
        {
            firstName: "Steward",
            lastName: "Jack",
            telephoneNumber: '+2712-479-4286',
            emailAddress: 'stewardjack@gmail.com',
            password: "Password123#",
            status: false,
            role: 'Manager'
        },
        {
            firstName: "Steven",
            lastName: "Jacky",
            telephoneNumber: '+2712-497-7482',
            emailAddress: 'stevenjacky@gmail.com',
            password: "Password123#",
            status: true,
            role: 'Employee'
        },
        {
            firstName: "Peter",
            lastName: "Rocky",
            telephoneNumber: '+2712-842-2468',
            emailAddress: 'peterrocky@gmail.com',
            password: "Password123#",
            status: false,
            role: 'Employee'
        },
        {
            firstName: "Jackson",
            lastName: "Chan",
            telephoneNumber: '+2712-986-8462',
            emailAddress: 'realjacksonchan@gmail.com',
            password: "Password123#",
            status: false,
            role: 'Employee'
        },
    ]
    const departments: Departments[] = [
        {
            name: "Software Department",
            status: true
        },
        {
            name: "Sales Department",
            status: true
        },
        {
            name: "Development Department",
            status: false
        },
        {
            name: "Testing Department",
            status: true
        },
        {
            name: "Security Department",
            status: true
        },
        {
            name: "Executive Department",
            status: false
        },
        {
            name: "On Site Department",
            status: true
        },
        {
            name: "Training Department",
            status: true
        }
    ]
    for (let index = 0; index < employeeData.length; index++) {
        const element = employeeData[index];
        if (element) {
            createEmployee.mutate(element)
            if (element.role !== "Manager") {
                if (index > 5) {
                    createEMLink.mutate({ employeeId: index, managerId: 1 })
                }
                else {
                    createEMLink.mutate({ employeeId: index, managerId: 2 })
                }
            }
            else{
                createManager.mutate({ name: element.firstName + ' ' + element.lastName, emailAddress: element.emailAddress })
            }
        }
    }
    for (let index = 0; index < departments.length; index++) {
        const element = departments[index];
        if(element){
            createDepartment.mutate(element)
            if(index<4){
                createDepartmentManagerLink.mutate({departmentId: index,managerId: 1})
            }
            else{
                createDepartmentManagerLink.mutate({departmentId: index,managerId: 2})
            }
        }
    }

}
