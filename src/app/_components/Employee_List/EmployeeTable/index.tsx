import React from 'react'
import { useTheme } from '@mui/material/styles';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import EditIcon from '@mui/icons-material/Edit';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }
  //this handles the Table Pagination buttons and selections
  const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  interface EmployeesData {
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

  interface Manager {
    id: number,
    managerName: string,
    emailAddress: string
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
    employeeData: EmployeesData[],
    editEmployee(data:EmployeesData ): void,
    user: Employees,
    changeStatus(id: number): void
  }
  // this is the table that is created
const EmployeeTable = (props: Props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.employeeData.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <TableCell sx={{fontSize: 18}} align="left">Actions</TableCell>
            <TableCell sx={{fontSize: 18}} align="left">First Name</TableCell>
            <TableCell sx={{fontSize: 18}} align="left">Last Name</TableCell>
            <TableCell sx={{fontSize: 18}} align="left">Telephone Number</TableCell>
            <TableCell sx={{fontSize: 18}} align="left">Email Address</TableCell>
            <TableCell sx={{fontSize: 18}} align="left">Manager</TableCell>
            <TableCell sx={{fontSize: 18}} align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? props.employeeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : props.employeeData
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell style={{ width: 200 }}  align="left">
              <Button startIcon={<EditIcon/>} disabled={props.user.role==='Manager' && props.user.id !== row.id} onClick={() => props.editEmployee(row)}/>
              <Button variant='text' disabled={props.user.role!=="HRAdmin"} onClick={() => props.changeStatus(row.id)} >{row.status ? 'Deactivate' : 'activate'}</Button>
              </TableCell>
              <TableCell style={{ width: 150 }} sx={{fontSize: 18}}  align="left">
                {row.firstName}
              </TableCell>
              <TableCell style={{ width: 160 }} sx={{fontSize: 18}} align="left">
                {row.lastName}
              </TableCell>
              <TableCell style={{ width: 160 }} sx={{fontSize: 18}} align="left">
                {row.telephoneNumber}
              </TableCell>
              <TableCell style={{ width: 160 }} sx={{fontSize: 18}} align="left">
                {row.emailAddress}
              </TableCell>
              <TableCell style={{ width: 160 }} sx={{fontSize: 18}} align="left">
                {row.manager.managerName}
              </TableCell>
              <TableCell style={{ width: 160 }} sx={{fontSize: 18}} align="left">
                {row.status ? 'Active' : 'Inactive'}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={props.employeeData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default EmployeeTable