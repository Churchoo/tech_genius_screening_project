import { Employees, PrismaClient } from "@prisma/client";

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
        emailAddress: 'stevjacky@gmail.com',
        password: "Password123#",
        status: true,
        role: 'Employee'
    },
    {
        firstName: "Peter",
        lastName: "Rocky",
        telephoneNumber: '+2712-842-2468',
        emailAddress: 'petrocky@gmail.com',
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
const prisma = new PrismaClient();
async function main() {
    const doubleCheck: CreateEmployee[] = [] 
    const checkEmails: string[] = []
    for (let index = 0; index < 11; index++) {
        const element = employeeData[index];
        if(element && !doubleCheck.includes(element)){
            doubleCheck.push(element)
            await prisma.employees.create({data: element})
            if(element.role==='Manager' && !checkEmails.includes(element.emailAddress))
            {
                checkEmails.push(element.emailAddress)
                await prisma.manager.create({data: {managerName: element.firstName + " " + element.lastName, emailAddress: element.emailAddress}})
            } else{
                if(index<4){
                    await prisma.managerEmployee.create({data: {EmployeeId: index, managerId: 1}})
                }
                else if(index<8){
                    await prisma.managerEmployee.create({data: {EmployeeId: index, managerId: 2}})
                }
                else{
                    await prisma.managerEmployee.create({data: {EmployeeId: index, managerId: 3}})
                }
            }
        }
    }
    for (let index = 0; index < 8; index++) {
        const element = departments[index];
        if(element){
            await prisma.departments.create({data: element})
            if(index<3){
                await prisma.managerDepartment.create({data: {DepartmentId: index, managerId: 1}})
            }
            else if(index<6){
                await prisma.managerDepartment.create({data: {DepartmentId: index, managerId: 2}})
            } 
            else
            {
                await prisma.managerDepartment.create({data: {DepartmentId: index, managerId: 3}})
            }
        }
    }
}
main().catch((e) => {
console.log(e);
process.exit(1);})