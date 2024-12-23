import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Tabs,
  Tab,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


interface CreateBillModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateBillModal({ open, onClose, onSave }: CreateBillModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('billProfiles');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('billProfiles', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    billName: Yup.string().required('Bill Name is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
    billsOwner: Yup.string().required('Bills Owner is required'),
    status: Yup.string().required('Status is required'),
    modeOfPayment: Yup.string().required('Mode of Payment is required'),
    subTotal: Yup.number().min(0, 'Sub Total must be greater than or equal to 0').required('Sub Total is required'),
    tax: Yup.number().min(0, 'Tax must be greater than or equal to 0').required('Tax is required'),
    grandTotal: Yup.number().min(0, 'Grand Total must be greater than or equal to 0').required('Grand Total is required')
  });

  const formik = useFormik({
    initialValues: {
      billName: '',
      activeLeadBills: '',
      billsLeadIdUpdate: '',
      leadBillIDBooks: '',
      billIDNotMatchInBooks: '',
      oldBillAutoNumber: '',
      creditorName: '',
      oldCreditorNameId: '',
      loanAccountNumber: '',
      customerEmail: '',
      creditorNameAlt: '',
      ptp: '',
      oldPTPRecordId: '',
      ownerEmail: '',
      billsOwner: '',
      leadName: '',
      oldLeadNameId: '',
      status: '',
      modeOfPayment: '',
      typeOfCredit: '',
      oldRecordId: '',
      billDate: '',
      dueDate: '',
      subTotal: '',
      tax: '',
      grandTotal: '',
      balance: '',
      paidDate: '',
      chequeIssuedDate: '',
      chequeClearingDate: '',
      booksBillID: '',
      paymentMade: ''
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = editingId
        ? data.map((item) => (item.id === editingId ? { ...values, id: editingId } : item))
        : [...data, { ...values, id: new Date().toISOString() }];

      handleSave(updatedData);
      formik.resetForm();
      setEditingId(null);
      setTabIndex(1);
      onClose();
      Swal.fire({
        title: 'Success!',
        text: 'Bill details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues(item);
      setEditingId(id);
      setTabIndex(0);
    }
  };

  const handleDelete = (id: string) => {
    onClose()
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
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={onClose}
        PaperProps={{ style: { borderRadius: '16px', padding: '16px', maxHeight: '90vh' } }}
      >
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
          Add/Edit Bill Details
          <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add/Edit Bill Details" />
          <Tab label="View Bill Details" />
        </Tabs>

        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              {/* Bill Information */}
              <Typography variant="h4" gutterBottom>
                Bill Information
              </Typography>
              <Grid container spacing={2}>
                {/* First Column */}
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

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="ownerEmail"
                    name="ownerEmail"
                    label="Owner Email"
                    value={formik.values.ownerEmail}
                    onChange={formik.handleChange}
                    error={formik.touched.ownerEmail && Boolean(formik.errors.ownerEmail)}
                    helperText={formik.touched.ownerEmail && formik.errors.ownerEmail}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="activeLeadBills"
                    name="activeLeadBills"
                    label="Active Lead Bills"
                    value={formik.values.activeLeadBills}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="billsOwner"
                    name="billsOwner"
                    label="Bills Owner"
                    value={formik.values.billsOwner}
                    onChange={formik.handleChange}
                    error={formik.touched.billsOwner && Boolean(formik.errors.billsOwner)}
                    helperText={formik.touched.billsOwner && formik.errors.billsOwner}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="billsLeadIdUpdate"
                    name="billsLeadIdUpdate"
                    label="Bills Lead Id update"
                    value={formik.values.billsLeadIdUpdate}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="leadName"
                    name="leadName"
                    label="Lead Name"
                    value={formik.values.leadName}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="leadBillIDBooks"
                    name="leadBillIDBooks"
                    label="Lead Bill ID Books"
                    value={formik.values.leadBillIDBooks}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="oldLeadNameId"
                    name="oldLeadNameId"
                    label="Old Lead Name Id"
                    value={formik.values.oldLeadNameId}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="billIDNotMatchInBooks"
                    name="billIDNotMatchInBooks"
                    label="Bill ID Not Match In Books"
                    value={formik.values.billIDNotMatchInBooks}
                    onChange={formik.handleChange}
                  />
                </Grid>

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
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Unpaid">Unpaid</MenuItem>
                  </TextField>
                </Grid>

                {/* Old Bill Auto Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="oldBillAutoNumber"
                    name="oldBillAutoNumber"
                    label="Old Bill Auto Number"
                    value={formik.values.oldBillAutoNumber}
                    onChange={formik.handleChange}
                  />
                </Grid>

                {/* Creditor's Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="creditorName"
                    name="creditorName"
                    label="Creditor's Name"
                    value={formik.values.creditorName}
                    onChange={formik.handleChange}
                  />
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

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="oldCreditorNameId"
                    name="oldCreditorNameId"
                    label="Old Creditor's Name Id"
                    value={formik.values.oldCreditorNameId}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="typeOfCredit"
                    name="typeOfCredit"
                    label="Type of Credit"
                    value={formik.values.typeOfCredit}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="loanAccountNumber"
                    name="loanAccountNumber"
                    label="Loan Account Number"
                    value={formik.values.loanAccountNumber}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="oldRecordId"
                    name="oldRecordId"
                    label="Old Record Id"
                    value={formik.values.oldRecordId}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="customerEmail"
                    name="customerEmail"
                    label="Customer Email"
                    value={formik.values.customerEmail}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="creditorNameAlt"
                    name="creditorNameAlt"
                    label="Creditor Name (Alt)"
                    value={formik.values.creditorNameAlt}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth id="ptp" name="ptp" label="PTP" value={formik.values.ptp} onChange={formik.handleChange} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="oldPTPRecordId"
                    name="oldPTPRecordId"
                    label="Old PTP Record Id"
                    value={formik.values.oldPTPRecordId}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              {/* Bill Details */}
              <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
                Bill Details
              </Typography>
              <Grid container spacing={2}>
                {/* Bill Date */}
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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

                {/* Paid Date */}
                <Grid item xs={12} md={4}>
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

                {/* Cheque Issued Date */}
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Cheque Issued Date"
                    value={formik.values.chequeIssuedDate ? dayjs(formik.values.chequeIssuedDate) : null}
                    onChange={(newValue) => formik.setFieldValue('chequeIssuedDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.chequeIssuedDate),
                        helperText: formik.errors.chequeIssuedDate
                      }
                    }}
                  />
                </Grid>

                {/* Cheque Clearing Date */}
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Cheque Clearing Date"
                    value={formik.values.chequeClearingDate ? dayjs(formik.values.chequeClearingDate) : null}
                    onChange={(newValue) => formik.setFieldValue('chequeClearingDate', newValue)}
                    slotProps={{
                      textField: {
                        error: Boolean(formik.errors.chequeClearingDate),
                        helperText: formik.errors.chequeClearingDate
                      }
                    }}
                  />
                </Grid>

                {/* Sub Total */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="subTotal"
                    name="subTotal"
                    label="Sub Total"
                    value={formik.values.subTotal}
                    onChange={formik.handleChange}
                    error={formik.touched.subTotal && Boolean(formik.errors.subTotal)}
                    helperText={formik.touched.subTotal && formik.errors.subTotal}
                  />
                </Grid>

                {/* Tax */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="tax"
                    name="tax"
                    label="Tax"
                    value={formik.values.tax}
                    onChange={formik.handleChange}
                    error={formik.touched.tax && Boolean(formik.errors.tax)}
                    helperText={formik.touched.tax && formik.errors.tax}
                  />
                </Grid>

                {/* Grand Total */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="grandTotal"
                    name="grandTotal"
                    label="Grand Total"
                    value={formik.values.grandTotal}
                    onChange={formik.handleChange}
                    error={formik.touched.grandTotal && Boolean(formik.errors.grandTotal)}
                    helperText={formik.touched.grandTotal && formik.errors.grandTotal}
                  />
                </Grid>

                {/* Payment Made */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    id="paymentMade"
                    name="paymentMade"
                    label="Payment Made"
                    value={formik.values.paymentMade}
                    onChange={formik.handleChange}
                    error={formik.touched.modeOfPayment && Boolean(formik.errors.paymentMade)}
                    helperText={formik.touched.modeOfPayment && formik.errors.paymentMade}
                  >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="Net Banking">Net Banking</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                  </TextField>
                </Grid>

                {/* Balance */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="balance"
                    name="balance"
                    label="Balance"
                    value={formik.values.balance}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              {/* Backend Fields */}
              <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
                Backend Fields
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="booksBillID"
                    name="booksBillID"
                    label="Books Bill ID"
                    value={formik.values.booksBillID}
                    onChange={formik.handleChange}
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

        {/* View Bill Details Tab */}
        {tabIndex === 1 && (
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bill Name</TableCell>
                    <TableCell>Owner Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Mode of Payment</TableCell>
                    <TableCell>Sub Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.billName}</TableCell>
                      <TableCell>{item.ownerEmail}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.modeOfPayment}</TableCell>
                      <TableCell>{item.subTotal}</TableCell>
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
