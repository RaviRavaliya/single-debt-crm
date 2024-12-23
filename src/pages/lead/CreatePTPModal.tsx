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
  Switch,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CreatePTPModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreatePTPModal({ open, onClose, onSave }: CreatePTPModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('ptpProfiles');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('ptpProfiles', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    oldPtpName: Yup.string().required('Old PTP Name is required'),
    lead: Yup.string().required('Lead is required'),
    paymentNumber: Yup.number().required('Payment Number is required'),
    tokenAmount: Yup.number().required('Token Amount is required'),
    billCycleNumber: Yup.number().required('Bill Cycle Number is required'),
    tokenPaymentLink: Yup.string().required('Token Payment Link is required'),
    exchangeRate: Yup.number().required('Exchange Rate is required'),
    oldRecordId: Yup.string().required('Old Record ID is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
    ptpOwner: Yup.string().required('PTP Owner is required'),
    leadEmail: Yup.string().email('Invalid email').required('Lead Email is required'),
    tokenAmountPaidDate: Yup.string().required('Token Amount Paid Date is required'),
    tokenPaymentStatus: Yup.string().required('Token Payment Status is required'),
    currency: Yup.string().required('Currency is required'),

    // Other Details Section
    callerName: Yup.string().required('Caller Name is required'),
    bankName: Yup.string().required('Bank Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    paidDate: Yup.string().required('Paid Date is required'),
    accountManagerName: Yup.string().required('Account Manager Name is required'),
    accountManagerEmail: Yup.string().email('Invalid email').required('Account Manager Email is required'),
    paraLegalAgentName: Yup.string().required('Para Legal Agent Name is required'),
    callerNumber: Yup.string().required('Caller Number is required'),
    city: Yup.string().required('City is required'),
    ptpAmountProposed: Yup.string().required('PTP Amount Proposed is required'),
    totalAmountPaid: Yup.string().required('Total Amount Paid is required'),
    paymentStatus: Yup.string().required('Payment Status is required'),
    ptpPaymentLink: Yup.string().required('PTP Payment Link is required'),
  });

  const formik = useFormik({
    initialValues: {
      oldPtpName: '',
      lead: '',
      paymentNumber: '',
      tokenAmount: '',
      billCycleNumber: '',
      tokenPaymentLink: '',
      exchangeRate: '',
      oldRecordId: '',
      ownerEmail: '',
      ptpOwner: '',
      leadEmail: '',
      tokenAmountPaidDate: '',
      tokenPaymentStatus: '',
      currency: '',
      // Other Details Section
      callerName: '',
      bankName: '',
      accountNumber: '',
      paidDate: '',
      accountManagerName: '',
      accountManagerEmail: '',
      paraLegalAgentName: '',
      callerNumber: '',
      city: '',
      ptpAmountProposed: '',
      totalAmountPaid: '',
      paymentStatus: '',
      ptpPaymentLink: '',
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
        text: 'PTP details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
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
      }
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle    sx={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        background: '#e74c3c',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        Create PTP
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="PTP Information" />
          <Tab label="PTP List" />
        </Tabs>
        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
             <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
                  {/* PTP Information */}
            <Typography variant="h4" gutterBottom>
            PTP Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Old PTP Name"
                  fullWidth
                  {...formik.getFieldProps('oldPtpName')}
                  error={formik.touched.oldPtpName && Boolean(formik.errors.oldPtpName)}
                  helperText={formik.touched.oldPtpName && formik.errors.oldPtpName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lead"
                  fullWidth
                  {...formik.getFieldProps('lead')}
                  error={formik.touched.lead && Boolean(formik.errors.lead)}
                  helperText={formik.touched.lead && formik.errors.lead}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='number'
                  label="Payment Number"
                  fullWidth
                  {...formik.getFieldProps('paymentNumber')}
                  error={formik.touched.paymentNumber && Boolean(formik.errors.paymentNumber)}
                  helperText={formik.touched.paymentNumber && formik.errors.paymentNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='number'
                  label="Token Amount"
                  fullWidth
                  {...formik.getFieldProps('tokenAmount')}
                  error={formik.touched.tokenAmount && Boolean(formik.errors.tokenAmount)}
                  helperText={formik.touched.tokenAmount && formik.errors.tokenAmount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='number'
                  label="Bill Cycle Number"
                  fullWidth
                  {...formik.getFieldProps('billCycleNumber')}
                  error={formik.touched.billCycleNumber && Boolean(formik.errors.billCycleNumber)}
                  helperText={formik.touched.billCycleNumber && formik.errors.billCycleNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Token Payment Link"
                  fullWidth
                  {...formik.getFieldProps('tokenPaymentLink')}
                  error={formik.touched.tokenPaymentLink && Boolean(formik.errors.tokenPaymentLink)}
                  helperText={formik.touched.tokenPaymentLink && formik.errors.tokenPaymentLink}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                 type='number'
                  label="Exchange Rate"
                  fullWidth
                  {...formik.getFieldProps('exchangeRate')}
                  error={formik.touched.exchangeRate && Boolean(formik.errors.exchangeRate)}
                  helperText={formik.touched.exchangeRate && formik.errors.exchangeRate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Old Record ID"
                  fullWidth
                  {...formik.getFieldProps('oldRecordId')}
                  error={formik.touched.oldRecordId && Boolean(formik.errors.oldRecordId)}
                  helperText={formik.touched.oldRecordId && formik.errors.oldRecordId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='email'
                  label="Owner Email"
                  fullWidth
                  {...formik.getFieldProps('ownerEmail')}
                  error={formik.touched.ownerEmail && Boolean(formik.errors.ownerEmail)}
                  helperText={formik.touched.ownerEmail && formik.errors.ownerEmail}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="PTP Owner"
                  fullWidth
                  {...formik.getFieldProps('ptpOwner')}
                  error={formik.touched.ptpOwner && Boolean(formik.errors.ptpOwner)}
                  helperText={formik.touched.ptpOwner && formik.errors.ptpOwner}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='email'
                  label="Lead Email"
                  fullWidth
                  {...formik.getFieldProps('leadEmail')}
                  error={formik.touched.leadEmail && Boolean(formik.errors.leadEmail)}
                  helperText={formik.touched.leadEmail && formik.errors.leadEmail}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                  label="Token Amount Paid Date"
                  fullWidth
                  {...formik.getFieldProps('tokenAmountPaidDate')}
                  error={formik.touched.tokenAmountPaidDate && Boolean(formik.errors.tokenAmountPaidDate)}
                  helperText={formik.touched.tokenAmountPaidDate && formik.errors.tokenAmountPaidDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Token Payment Status"
                  fullWidth
                  {...formik.getFieldProps('tokenPaymentStatus')}
                  error={formik.touched.tokenPaymentStatus && Boolean(formik.errors.tokenPaymentStatus)}
                  helperText={formik.touched.tokenPaymentStatus && formik.errors.tokenPaymentStatus}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Currency"
                  fullWidth
                  {...formik.getFieldProps('currency')}
                  error={formik.touched.currency && Boolean(formik.errors.currency)}
                  helperText={formik.touched.currency && formik.errors.currency}
                />
              </Grid>
              </Grid>
              {/* Other Details Section */}
              <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
              Other Details
            </Typography>
              <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Caller Name"
                  fullWidth
                  {...formik.getFieldProps('callerName')}
                  error={formik.touched.callerName && Boolean(formik.errors.callerName)}
                  helperText={formik.touched.callerName && formik.errors.callerName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Bank Name"
                  fullWidth
                  {...formik.getFieldProps('bankName')}
                  error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                  helperText={formik.touched.bankName && formik.errors.bankName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type="number"
                  label="Account Number"
                  fullWidth
                  {...formik.getFieldProps('accountNumber')}
                  error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                  helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type="date"
                  label="Paid Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  {...formik.getFieldProps('paidDate')}
                  error={formik.touched.paidDate && Boolean(formik.errors.paidDate)}
                  helperText={formik.touched.paidDate && formik.errors.paidDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Account Manager Name"
                  fullWidth
                  {...formik.getFieldProps('accountManagerName')}
                  error={formik.touched.accountManagerName && Boolean(formik.errors.accountManagerName)}
                  helperText={formik.touched.accountManagerName && formik.errors.accountManagerName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type="email"
                  label="Account Manager Email"
                  fullWidth
                  {...formik.getFieldProps('accountManagerEmail')}
                  error={formik.touched.accountManagerEmail && Boolean(formik.errors.accountManagerEmail)}
                  helperText={formik.touched.accountManagerEmail && formik.errors.accountManagerEmail}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Para Legal Agent Name"
                  fullWidth
                  {...formik.getFieldProps('paraLegalAgentName')}
                  error={formik.touched.paraLegalAgentName && Boolean(formik.errors.paraLegalAgentName)}
                  helperText={formik.touched.paraLegalAgentName && formik.errors.paraLegalAgentName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type="number"
                  label="Caller Number"
                  fullWidth
                  {...formik.getFieldProps('callerNumber')}
                  error={formik.touched.callerNumber && Boolean(formik.errors.callerNumber)}
                  helperText={formik.touched.callerNumber && formik.errors.callerNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  fullWidth
                  {...formik.getFieldProps('city')}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='number'
                  label="PTP Amount Proposed"
                  fullWidth
                  {...formik.getFieldProps('ptpAmountProposed')}
                  error={formik.touched.ptpAmountProposed && Boolean(formik.errors.ptpAmountProposed)}
                  helperText={formik.touched.ptpAmountProposed && formik.errors.ptpAmountProposed}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='number'
                  label="Total Amount Paid"
                  fullWidth
                  {...formik.getFieldProps('totalAmountPaid')}
                  error={formik.touched.totalAmountPaid && Boolean(formik.errors.totalAmountPaid)}
                  helperText={formik.touched.totalAmountPaid && formik.errors.totalAmountPaid}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payment Status"
                  fullWidth
                  {...formik.getFieldProps('paymentStatus')}
                  error={formik.touched.paymentStatus && Boolean(formik.errors.paymentStatus)}
                  helperText={formik.touched.paymentStatus && formik.errors.paymentStatus}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                type='url'
                  label="PTP Payment Link"
                  fullWidth
                  {...formik.getFieldProps('ptpPaymentLink')}
                  error={formik.touched.ptpPaymentLink && Boolean(formik.errors.ptpPaymentLink)}
                  helperText={formik.touched.ptpPaymentLink && formik.errors.ptpPaymentLink}
                />
              </Grid>
              </Grid></DialogContent>
              <DialogActions>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Old PTP Name</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Payment Number</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.oldPtpName}</TableCell>
                    <TableCell>{item.lead}</TableCell>
                    <TableCell>{item.paymentNumber}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(item.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
