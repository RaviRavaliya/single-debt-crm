import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface CreateCreditorPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreditorPaymentModal({ open, onClose, onSave }: CreateCreditorPaymentModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('creditorPayments');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('creditorPayments', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    leadName: Yup.string().required('Lead Name is required'),
    billName: Yup.string().required('Bill Name is required'),
    creditorName: Yup.string().required('Creditor Name is required'),
    billOwner: Yup.string().required('Bill Owner Name is required'),
    customeremail: Yup.string().email('Invalid customer email').required('Customer email is required'),
    modeOfPayment: Yup.string().required('Mode of Payment is required'),
    paymentMade: Yup.string().required('Payment Made is required'),
    paymentStatus: Yup.string().required('Payment Status is required'),
    accountNumber: Yup.number().required('Account Number is required'),
    balance: Yup.number().required('Balance is required'),
    subTotal: Yup.number().required('Sub Total Number is required'),
    grandTotal: Yup.number().required('Grand Total is required'),
    tax: Yup.number().min(0, 'Tax must be at least 0%').max(100, 'Tax cannot be more than 100%').required('Tax is required'),
    billCycleNumber: Yup.number().required('Bill Cycle Number is required'),
    billDate: Yup.date().required('Bill Date is required'),
    createdBy: Yup.object({
        name: Yup.string().required('Required'),
        datetime: Yup.date().required('Required'),
      }),
      modifiedBy: Yup.object({
        name: Yup.string().required('Required'),
        datetime: Yup.date().required('Required'),
      }),
    dueDate: Yup.date().required('Due Date is required'),
    paidDate: Yup.date().required('Paid Date is required'),
    checkIssueDate: Yup.date().required('Check Issue Date is required'),
    checkClearingDate: Yup.date().required('Check Clearing Date is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
    creditorPaymentOwner: Yup.string().required('Creditor Payment Owner is required'),
    status: Yup.string().required('Status is required').typeError('Status must be a string'),
    typeOfCredit: Yup.string().required('Type of Credit is required'),
    paidAmount: Yup.number().required('Paid Amount is required'),
  });

  const formik = useFormik({
    initialValues: {
      billOwner: '',
      leadName: '',
      billName: '',
      creditorName: '',
      customeremail: '',
      modeOfPayment: '',
      paymentMade: '',
      dueDate: null,
      billDate: null,
      paidDate: null,
      tax: '',
      checkIssueDate: null,
      checkClearingDate: null,
      paymentStatus: '',
      accountNumber: '',
      balance: '',
      billCycleNumber: '',
      subTotal: '',
      grandTotal: '',
      createdBy: { name: '', datetime: new Date() },
      modifiedBy: { name: '', datetime: new Date() },
      status: '',
      typeOfCredit: '',
    },
    validationSchema,
    // validateOnChange: false,  // Disable validation on change
    // validateOnBlur: false,     
    onSubmit: async (values, { setSubmitting }) => {
        try {
          const updatedData = editingId
            ? data.map((item) => (item.id === editingId ? { ...values, id: editingId } : item))
            : [...data, { ...values, id: new Date().toISOString() }];
      
          await handleSave(updatedData); // Assuming handleSave returns a Promise
      
          formik.resetForm();
          setEditingId(null);
          setTabIndex(1);
          onClose();
          onSave(values);
          Swal.fire({
            title: 'Success!',
            text: 'Creditor Payment has been saved successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error("Error saving data:", error);
        } finally {
          setSubmitting(false); // Resetting submitting state
        }
      }
      
  });

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues(item);
      setProfileImageURL(item.profileImage); // Load the stored image if available
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
        const updatedData = data.filter((item) => item.id !== id);
        handleSave(updatedData);
        Swal.fire('Deleted!', 'Your entry has been deleted.', 'success');
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
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
            alignItems: 'center'
          }}
        >
          Add/Edit Creditor Payment Details
          <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add/Edit Creditor Payment Details" />
          <Tab label="View Creditor Payment Details" />
        </Tabs>
        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              <Typography variant="h4" gutterBottom>
                Main Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="leadName"
                    name="leadName"
                    label="Lead Name"
                    value={formik.values.leadName}
                    onChange={formik.handleChange}
                    error={formik.touched.leadName && Boolean(formik.errors.leadName)}
                    helperText={formik.touched.leadName && formik.errors.leadName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='email'
                    id="customeremail"
                    name="customeremail"
                    label="Customer Email"
                    value={formik.values.customeremail}
                    onChange={formik.handleChange}
                    error={formik.touched.customeremail && Boolean(formik.errors.customeremail)}
                    helperText={formik.touched.customeremail && formik.errors.customeremail}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="billOwner"
                    name="billOwner"
                    label="Bill Owner"
                    value={formik.values.billOwner}
                    onChange={formik.handleChange}
                    error={formik.touched.billOwner && Boolean(formik.errors.billOwner)}
                    helperText={formik.touched.billOwner && formik.errors.billOwner}
                  />
                </Grid>
              </Grid>
              {/* {"Information"} */}
              <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
                Bills Information
              </Typography>
              <Grid container spacing={2}>
                {' '}
                {/* Bill Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="billName"
                    name="billName"
                    label="Bill Name"
                    value={formik.values.billName}
                    onChange={formik.handleChange}
                    error={formik.touched.billName && Boolean(formik.errors.billName)}
                    helperText={formik.touched.billName && formik.errors.billName}
                  />
                </Grid>
                {/* {"Creditor Name"} */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="creditorName"
                    name="creditorName"
                    label="Creditor Name"
                    value={formik.values.creditorName}
                    onChange={formik.handleChange}
                    error={formik.touched.creditorName && Boolean(formik.errors.creditorName)}
                    helperText={formik.touched.creditorName && formik.errors.creditorName}
                  />
                </Grid>
                {/* Status */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    id="status"
                    name="status"
                    label="Status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    helperText={formik.touched.status && formik.errors.status}
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </TextField>
                </Grid>
                {/* {"Loan Account Number"} */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    id="accountNumber"
                    name="accountNumber"
                    label="Loan Account Number"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                    helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                  />
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
                {/* Mode of Payment */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    id="modeOfPayment"
                    name="modeOfPayment"
                    label="Mode of Payment"
                    value={formik.values.modeOfPayment}
                    onChange={formik.handleChange}
                    error={formik.touched.modeOfPayment && Boolean(formik.errors.modeOfPayment)}
                    helperText={formik.touched.modeOfPayment && formik.errors.modeOfPayment}
                  >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="Net Banking">Net Banking</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                  </TextField>
                </Grid>
                {/* Created By Fields */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="createdByName"
                    name="createdBy.name"
                    label="Created By"
                    value={formik.values.createdBy.name}
                    onChange={formik.handleChange}
                    error={formik.touched.createdBy?.name && Boolean(formik.errors.createdBy?.name)}
                    helperText={formik.touched.createdBy?.name && formik.errors.createdBy?.name}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="createdByDatetime"
                    name="createdBy.datetime"
                    label="Created On"
                    value={new Date(formik.values.createdBy.datetime).toLocaleString()}
                    // Keep this field read-only with the default current date and time
                    InputProps={{
                      readOnly: true // Make the datetime field read-only
                    }}
                  />
                </Grid> */}
                {/* Modified By Fields */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="modifiedByName"
                    name="modifiedBy.name"
                    label="Modified By"
                    value={formik.values.modifiedBy.name}
                    onChange={formik.handleChange}
                    error={formik.touched.modifiedBy?.name && Boolean(formik.errors.modifiedBy?.name)}
                    helperText={formik.touched.modifiedBy?.name && formik.errors.modifiedBy?.name}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="modifiedByDatetime"
                    name="modifiedBy.datetime"
                    label="Modified On"
                    value={new Date(formik.values.modifiedBy.datetime).toLocaleString()}
                    // Keep this field read-only with the default current date and time
                    InputProps={{
                      readOnly: true // Make the datetime field read-only
                    }}
                  />
                </Grid> */}
              </Grid>
              {/* {"Bill Details"} */}
              <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
                Bill Details
              </Typography>
              <Grid container spacing={2}>
                {/* Bill Date */}
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Bill Date"
                    value={formik.values.billDate ? dayjs(formik.values.billDate) : null}
                    onChange={(newValue) => formik.setFieldValue('billDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.billDate),
                        helperText: formik.errors.billDate
                      }
                    }}
                  />
                </Grid>
                {/* Due Date */}
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Due Date"
                    value={formik.values.dueDate ? dayjs(formik.values.dueDate) : null}
                    onChange={(newValue) => formik.setFieldValue('dueDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.dueDate),
                        helperText: formik.errors.dueDate
                      }
                    }}
                  />
                </Grid>
                {/* Check Issue Date */}
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Check Issue Date"
                    value={formik.values.checkIssueDate ? dayjs(formik.values.checkIssueDate) : null}
                    onChange={(newValue) => formik.setFieldValue('checkIssueDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.checkIssueDate),
                        helperText: formik.errors.checkIssueDate
                      }
                    }}
                  />
                </Grid>
                {/* Check Clearing Date */}
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Check Clearing Date"
                    value={formik.values.checkClearingDate ? dayjs(formik.values.checkClearingDate) : null}
                    onChange={(newValue) => formik.setFieldValue('checkClearingDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.checkClearingDate),
                        helperText: formik.errors.checkClearingDate
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    id="billCycleNumber"
                    name="billCycleNumber"
                    label="Bill Cycle Number"
                    value={formik.values.billCycleNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.billCycleNumber && Boolean(formik.errors.billCycleNumber)}
                    helperText={formik.touched.billCycleNumber && formik.errors.billCycleNumber}
                  />
                </Grid>
                {/* {"Sub total"} */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    id="subTotal"
                    name="subTotal"
                    label="Sub Total"
                    value={formik.values.subTotal}
                    onChange={formik.handleChange}
                    error={formik.touched.subTotal && Boolean(formik.errors.subTotal)}
                    helperText={formik.touched.subTotal && formik.errors.subTotal}
                  />
                </Grid>
                {/* {"Grand total"} */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                  type='number'
                    id="grandTotal"
                    name="grandTotal"
                    label="Grand Total"
                    value={formik.values.grandTotal}
                    onChange={formik.handleChange}
                    error={formik.touched.grandTotal && Boolean(formik.errors.grandTotal)}
                    helperText={formik.touched.grandTotal && formik.errors.grandTotal}
                  />
                </Grid>
                {/* {" Tax "} */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="tax"
                    name="tax"
                    label="Tax (%)"
                    type="number" // Ensures only numeric input
                    value={formik.values.tax}
                    onChange={formik.handleChange}
                    error={formik.touched.tax && Boolean(formik.errors.tax)}
                    helperText={formik.touched.tax && formik.errors.tax}
                    inputProps={{ min: 0, max: 100 }} // Restrict input to 0 - 100
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="balance"
                    type='number'
                    name="balance"
                    label="Balance"
                    value={formik.values.balance}
                    onChange={formik.handleChange}
                    error={formik.touched.balance && Boolean(formik.errors.balance)}
                    helperText={formik.touched.balance && formik.errors.balance}
                  />
                </Grid>
                {/* Payment Made as dropdown */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    id="paymentMade"
                    name="paymentMade"
                    label="Payment Made"
                    value={formik.values.paymentMade}
                    onChange={formik.handleChange}
                    error={formik.touched.paymentMade && Boolean(formik.errors.paymentMade)}
                    helperText={formik.touched.paymentMade && formik.errors.paymentMade}
                  >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="Net Banking">Net Banking</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                  </TextField>
                </Grid>
                {/* Paid Date */}
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Paid Date"
                    value={formik.values.paidDate ? dayjs(formik.values.paidDate) : null}
                    onChange={(newValue) => formik.setFieldValue('paidDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.paidDate),
                        helperText: formik.errors.paidDate
                      }
                    }}
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Creditors Name</TableCell>
                    <TableCell>Customer Email</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Account Number</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.creditorName}</TableCell>
                      <TableCell>{item.customeremail}</TableCell>
                      <TableCell>{item.modeOfPayment}</TableCell>
                      <TableCell>{item.accountNumber}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item.id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} color="error">
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
