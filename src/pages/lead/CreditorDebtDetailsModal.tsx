import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';

interface CreditorDebtDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface CreditorDebtDetails {
  id: string;
  creditorsName: string;
  bankType: string;
  typeOfCredit: string;
  accountNumber: string;
  balanceOS: number;
  currentMonthlyEMI: number;
  noOfMissedEMI: number;
  sanctionedAmount: number;
  loanStartDate: Date | null;
  loanAgreementCopy: string;
}

export default function CreditorDebtDetailsModal({ open, onClose, onSave }: CreditorDebtDetailsModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [debtDetails, setDebtDetails] = useState<CreditorDebtDetails[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [totalEMIPerMonth, setTotalEMIPerMonth] = useState(0);
  const [totalAmountOfDebt, setTotalAmountOfDebt] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('debtDetails');
    if (storedData) {
      setDebtDetails(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: CreditorDebtDetails[]) => {
    localStorage.setItem('debtDetails', JSON.stringify(newData));
    setDebtDetails(newData);
  };

  const validationSchema = Yup.object({
    creditorsName: Yup.string()
      .required("Creditor's Name is required")
      .min(2, "Creditor's Name must be at least 2 characters long"),
    
    bankType: Yup.string()
      .required('Bank Type is required'),
    
    typeOfCredit: Yup.string()
      .required('Type of Credit is required')
      .oneOf(['Personal Loan', 'Home Loan', 'Car Loan'], 'Invalid Type of Credit'), // Adjust options as needed
    
    accountNumber: Yup.number()
      .typeError('Account number must be numeric')
      .positive('Account number must be positive')
      .required('Account number is required'),
    
    balanceOS: Yup.number()
      .typeError('Balance must be numeric')
      .positive('Balance O/S (₹) must be positive')
      .required('Balance O/S (₹) is required'),
    
    currentMonthlyEMI: Yup.number()
      .typeError('Current Monthly EMI must be numeric')
      .positive('Current Monthly EMI (₹) must be positive')
      .required('Current Monthly EMI (₹) is required'),
    
    noOfMissedEMI: Yup.number()
      .typeError('No of Missed EMI must be numeric')
      .min(0, 'No of Missed EMI cannot be negative') // Ensure no negative values
      .required('No of Missed EMI is required'),
    
    sanctionedAmount: Yup.number()
      .typeError('Sanctioned Amount must be numeric')
      .positive('Sanctioned Amount (₹) must be positive')
      .required('Sanctioned Amount (₹) is required'),
    
    loanStartDate: Yup.date()
      .nullable()
      .required('Loan Start Date is required')
      .min(new Date(2000, 0, 1), 'Loan Start Date must be after January 1, 2000'), // Example minimum date
    
    loanAgreementCopy: Yup.string()
      .required('Copy of Loan Agreement is required')
  });
  

  const formik = useFormik<CreditorDebtDetails>({
    initialValues: {
      id: '',
      creditorsName: '',
      bankType: '',
      typeOfCredit: '',
      accountNumber: '',
      balanceOS: 0,
      currentMonthlyEMI: 0,
      noOfMissedEMI: 0,
      sanctionedAmount: 0,
      loanStartDate: null,
      loanAgreementCopy: ''
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = editingId
        ? debtDetails.map((item) => (item.id === editingId ? { ...values, id: editingId } : item))
        : [...debtDetails, { ...values, id: new Date().toISOString() }];

      handleSave(updatedData);
      formik.resetForm();
      setEditingId(null);
      setTabIndex(1); // Switch to view tab after saving
      onSave(values)
      onClose();
      Swal.fire({
        title: 'Success!',
        text: 'Debt details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  useEffect(() => {
    const balanceOS = parseFloat(formik.values.balanceOS as unknown as string) || 0;
    const currentMonthlyEMI = parseFloat(formik.values.currentMonthlyEMI as unknown as string) || 0;

    setTotalEMIPerMonth(currentMonthlyEMI);
    setTotalAmountOfDebt(balanceOS);
  }, [formik.values.balanceOS, formik.values.currentMonthlyEMI]);

  const handleEdit = (id: string) => {
    const item = debtDetails.find((d) => d.id === id);
    if (item) {
      formik.setValues({
        ...item,
        loanStartDate: item.loanStartDate ? new Date(item.loanStartDate) : null
      });
      setEditingId(id);
      setTabIndex(0);
    }
  };

  const handleDelete = (id: string) => {
    onClose();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = debtDetails.filter((item) => item.id !== id);
        handleSave(updatedData);
        Swal.fire('Deleted!', 'Your entry has been deleted.', 'success');
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog    
         maxWidth="lg" open={open} onClose={onClose} fullWidth 
         PaperProps={{ style: { borderRadius: '16px', padding: '16px', maxHeight:"90vh" } }}>
        <DialogTitle
          sx={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            background: '#e74c3c',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Creditor Debt Details
          <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add Details" />
          <Tab label="View Details" />
        </Tabs>

        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              <Grid container spacing={2}>
                {/* Creditor's Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                  type='text'
                    fullWidth
                    id="creditorsName"
                    name="creditorsName"
                    label="Creditor's Name"
                    value={formik.values.creditorsName}
                    onChange={formik.handleChange}
                    error={formik.touched.creditorsName && Boolean(formik.errors.creditorsName)}
                    helperText={formik.touched.creditorsName && formik.errors.creditorsName}
                  />
                </Grid>

                {/* Bank Type (Dropdown) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    id="bankType"
                    name="bankType"
                    label="Bank Type"
                    value={formik.values.bankType}
                    onChange={formik.handleChange}
                    error={formik.touched.bankType && Boolean(formik.errors.bankType)}
                    helperText={formik.touched.bankType && formik.errors.bankType}
                  >
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                  </TextField>
                </Grid>

                {/* Type of Credit (Dropdown) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    id="typeOfCredit"
                    name="typeOfCredit"
                    label="Type of Credit"
                    value={formik.values.typeOfCredit}
                    onChange={formik.handleChange}
                    error={formik.touched.typeOfCredit && Boolean(formik.errors.typeOfCredit)}
                    helperText={formik.touched.typeOfCredit && formik.errors.typeOfCredit}
                  >
                    <MenuItem value="Home Loan">Home Loan</MenuItem>
                    <MenuItem value="Personal Loan">Personal Loan</MenuItem>
                    <MenuItem value="Car Loan">Car Loan</MenuItem>
                  </TextField>
                </Grid>

                {/* Account Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="accountNumber"
                    name="accountNumber"
                    label="Account Number"
                    type="number"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                    helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                  />
                </Grid>

                {/* Balance O/S (₹) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="balanceOS"
                    name="balanceOS"
                    label="Balance O/S (₹)"
                    type="number"
                    value={formik.values.balanceOS}
                    onChange={formik.handleChange}
                    error={formik.touched.balanceOS && Boolean(formik.errors.balanceOS)}
                    helperText={formik.touched.balanceOS && formik.errors.balanceOS}
                  />
                </Grid>

                {/* Current Monthly EMI (₹) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="currentMonthlyEMI"
                    name="currentMonthlyEMI"
                    label="Current Monthly EMI (₹)"
                    type="number"
                    value={formik.values.currentMonthlyEMI}
                    onChange={formik.handleChange}
                    error={formik.touched.currentMonthlyEMI && Boolean(formik.errors.currentMonthlyEMI)}
                    helperText={formik.touched.currentMonthlyEMI && formik.errors.currentMonthlyEMI}
                  />
                </Grid>

                {/* No of Missed EMI */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="noOfMissedEMI"
                    name="noOfMissedEMI"
                    label="No of Missed EMI"
                    type="number"
                    value={formik.values.noOfMissedEMI}
                    onChange={formik.handleChange}
                    error={formik.touched.noOfMissedEMI && Boolean(formik.errors.noOfMissedEMI)}
                    helperText={formik.touched.noOfMissedEMI && formik.errors.noOfMissedEMI}
                  />
                </Grid>

                {/* Sanctioned Amount (₹) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="sanctionedAmount"
                    name="sanctionedAmount"
                    label="Sanctioned Amount (₹)"
                    type="number"
                    value={formik.values.sanctionedAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.sanctionedAmount && Boolean(formik.errors.sanctionedAmount)}
                    helperText={formik.touched.sanctionedAmount && formik.errors.sanctionedAmount}
                  />
                </Grid>

                {/* Loan Start Date */}
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Loan Start Date"
                    value={formik.values.loanStartDate || null}
                    onChange={(newValue) => formik.setFieldValue('loanStartDate', newValue ? new Date(newValue) : null)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.loanStartDate && Boolean(formik.errors.loanStartDate),
                        helperText: formik.touched.loanStartDate && formik.errors.loanStartDate
                      }
                    }}
                  />
                </Grid>

                {/* Copy of Loan Agreement (Dropdown) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    id="loanAgreementCopy"
                    name="loanAgreementCopy"
                    label="Copy of Loan Agreement"
                    value={formik.values.loanAgreementCopy}
                    onChange={formik.handleChange}
                    error={formik.touched.loanAgreementCopy && Boolean(formik.errors.loanAgreementCopy)}
                    helperText={formik.touched.loanAgreementCopy && formik.errors.loanAgreementCopy}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                </Grid>

                {/* Total EMI Payment per Month */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="totalEMIPerMonth"
                    name="totalEMIPerMonth"
                    label="Total EMI Payment per Month (₹)"
                    value={totalEMIPerMonth}
                    InputProps={{ readOnly: true }}
                    helperText="Calculated from Current Monthly EMI"
                  />
                </Grid>

                {/* Total Amount of Debt */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="totalAmountOfDebt"
                    name="totalAmountOfDebt"
                    label="Total Amount of Debt (₹)"
                    value={totalAmountOfDebt}
                    InputProps={{ readOnly: true }}
                    helperText="Calculated from Balance O/S"
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px', backgroundColor: '#f0f0f0' }}>
              <Button
                onClick={onClose}
                variant="contained"
                sx={{
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  borderRadius: '24px',
                  padding: '10px 24px',
                  '&:hover': {
                    backgroundColor: '#c0392b'
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#3498db',
                  color: '#fff',
                  borderRadius: '24px',
                  padding: '10px 24px',
                  marginLeft: '16px',
                  '&:hover': {
                    backgroundColor: '#2980b9'
                  }
                }}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        )}

        {tabIndex === 1 && (
          <DialogContent>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table sx={{ minWidth: 800 }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Creditor's Name</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Bank Type</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Type of Credit</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Account Number</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Balance O/S (₹)</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Current Monthly EMI (₹)</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debtDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{detail.creditorsName}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{detail.bankType}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{detail.typeOfCredit}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{detail.accountNumber}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{detail.balanceOS}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{detail.currentMonthlyEMI}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton onClick={() => handleEdit(detail.id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(detail.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        )}
      </Dialog>
    </LocalizationProvider>
  );
}
