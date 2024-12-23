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
  Tab
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

interface CreateCreditorRecordModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateCreditorRecordModal({ open, onClose, onSave }: CreateCreditorRecordModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('creditorRecords');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('creditorRecords', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    creditorsName: Yup.string().required('Creditors Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    paymentStatus: Yup.string().required('Payment Status is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    creditorPaymentPendingReason: Yup.string().required('Creditor Payment Pending Reason is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
    creditorRecordOwner: Yup.string().required('Creditor Record Owner is required'),
    leadName: Yup.string().required('Lead Name is required'),
    status: Yup.string().required('Status is required'),
    offerLetterDate: Yup.date().required('Offer Letter Date is required'),
    typeOfCredit: Yup.string().required('Type of Credit is required'),
    currency: Yup.string().required('Currency is required'),
    totalDebtAmount: Yup.number().required('Total Debt Amount is required'),
    remainingDebtAmount: Yup.number().required('Remaining Debt Amount is required'),
    paidAmount: Yup.number().required('Paid Amount is required'),
    reasonOfExclusion: Yup.string().required('Reason of Exclusion is required'),
    loanAccountNumber: Yup.string().required('Loan Account Number is required'),
    ptpAmount: Yup.string().required('PTP Amount is required'),
    ptp: Yup.string().required('PTP is required'),
    ratio: Yup.number().required('Ratio is required'),
    actualCreditorsAmount: Yup.number().required("Actual Creditor's Amount is required"),
    actionNeeded: Yup.string().required('Action Needed is required'),
    keepAmountFixed: Yup.string().required('Keep Amount Fixed is required'),
    dmpCycleNumber: Yup.string().required('DMP Cycle Number is required'),
    reasonToKeepAmountFixed: Yup.string().required('Reason to Keep Amount Fixed is required'),
    crtNo: Yup.string().required('CRT No is required')
  });

  const formik = useFormik({
    initialValues: {
      creditorsName: '',
      email: '',
      paymentStatus: '',
      accountNumber: '',
      oldRecord: '',
      oldRecordId: '',
      exchangeRate: 1,
      creditorPaymentPendingReason: '',
      ownerEmail: '',
      creditorRecordOwner: '',
      leadName: '',
      oldLeadNameLookupId: '',
      status: '',
      offerLetterDate: '',
      typeOfCredit: '',
      currency: 'INR',
      totalDebtAmount: 0,
      remainingDebtAmount: 0,
      paidAmount: 0,
      reasonOfExclusion: '',
      loanAccountNumber: '',
      ptpAmount: '',
      ptp: '',
      oldPtpLookupId: '',
      ratio: 0,
      actualCreditorsAmount: 0,
      actionNeeded: '',
      keepAmountFixed: '',
      dmpCycleNumber: '',
      reasonToKeepAmountFixed: '',
      crtNo: '',
      creditorId: '',
      expectedCreditorsAmount: 0,
      creditorsProfile: '',
      oldCreditorsProfileLookupId: ''
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
      onSave(values);
      Swal.fire({
        title: 'Success!',
        text: 'Creditor record has been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'profileImage') {
          setProfileImageURL(reader.result as string);
        }
        formik.setFieldValue(field, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

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
        alignItems: 'center',
      }}
    >
        Add/Edit Creditor Record Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add/Edit Creditor Record Details" />
        <Tab label="View Creditor Record Details" />
      </Tabs>
      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Typography variant="h4" gutterBottom>
              Creditor Record Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditorsName"
                  name="creditorsName"
                  label="Creditors Name"
                  value={formik.values.creditorsName}
                  onChange={formik.handleChange}
                  error={formik.touched.creditorsName && Boolean(formik.errors.creditorsName)}
                  helperText={formik.touched.creditorsName && formik.errors.creditorsName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="paymentStatus"
                  name="paymentStatus"
                  label="Payment Status"
                  value={formik.values.paymentStatus}
                  onChange={formik.handleChange}
                  error={formik.touched.paymentStatus && Boolean(formik.errors.paymentStatus)}
                  helperText={formik.touched.paymentStatus && formik.errors.paymentStatus}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="accountNumber"
                  name="accountNumber"
                  label="Account Number"
                  value={formik.values.accountNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                  helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                />
              </Grid>
              {/* Other fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldRecord"
                  name="oldRecord"
                  label="Old Record"
                  value={formik.values.oldRecord}
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
                  id="exchangeRate"
                  name="exchangeRate"
                  label="Exchange Rate"
                  value={formik.values.exchangeRate}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditorPaymentPendingReason"
                  name="creditorPaymentPendingReason"
                  label="Creditor Payment Pending Reason"
                  value={formik.values.creditorPaymentPendingReason}
                  onChange={formik.handleChange}
                  error={formik.touched.creditorPaymentPendingReason && Boolean(formik.errors.creditorPaymentPendingReason)}
                  helperText={formik.touched.creditorPaymentPendingReason && formik.errors.creditorPaymentPendingReason}
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
                  id="creditorRecordOwner"
                  name="creditorRecordOwner"
                  label="Creditor Record Owner"
                  value={formik.values.creditorRecordOwner}
                  onChange={formik.handleChange}
                  error={formik.touched.creditorRecordOwner && Boolean(formik.errors.creditorRecordOwner)}
                  helperText={formik.touched.creditorRecordOwner && formik.errors.creditorRecordOwner}
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
                  error={formik.touched.leadName && Boolean(formik.errors.leadName)}
                  helperText={formik.touched.leadName && formik.errors.leadName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldLeadNameLookupId"
                  name="oldLeadNameLookupId"
                  label="Old Lead Name Lookup Id"
                  value={formik.values.oldLeadNameLookupId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="status"
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="offerLetterDate"
                  name="offerLetterDate"
                  label="Offer Letter Date"
                  value={formik.values.offerLetterDate}
                  onChange={formik.handleChange}
                  error={formik.touched.offerLetterDate && Boolean(formik.errors.offerLetterDate)}
                  helperText={formik.touched.offerLetterDate && formik.errors.offerLetterDate}
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
                  error={formik.touched.typeOfCredit && Boolean(formik.errors.typeOfCredit)}
                  helperText={formik.touched.typeOfCredit && formik.errors.typeOfCredit}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="currency"
                  name="currency"
                  label="Currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  error={formik.touched.currency && Boolean(formik.errors.currency)}
                  helperText={formik.touched.currency && formik.errors.currency}
                />
              </Grid>
            </Grid>
            {/* {"Information"} */}
            <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
              Information
            </Typography>
            <Grid container spacing={2}>
              {' '}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="totalDebtAmount"
                  name="totalDebtAmount"
                  label="Total Debt Amount"
                  value={formik.values.totalDebtAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.totalDebtAmount && Boolean(formik.errors.totalDebtAmount)}
                  helperText={formik.touched.totalDebtAmount && formik.errors.totalDebtAmount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="remainingDebtAmount"
                  name="remainingDebtAmount"
                  label="Remaining Debt Amount"
                  value={formik.values.remainingDebtAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.remainingDebtAmount && Boolean(formik.errors.remainingDebtAmount)}
                  helperText={formik.touched.remainingDebtAmount && formik.errors.remainingDebtAmount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="paidAmount"
                  name="paidAmount"
                  label="Paid Amount"
                  value={formik.values.paidAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.paidAmount && Boolean(formik.errors.paidAmount)}
                  helperText={formik.touched.paidAmount && formik.errors.paidAmount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="reasonOfExclusion"
                  name="reasonOfExclusion"
                  label="Reason of Exclusion"
                  value={formik.values.reasonOfExclusion}
                  onChange={formik.handleChange}
                  error={formik.touched.reasonOfExclusion && Boolean(formik.errors.reasonOfExclusion)}
                  helperText={formik.touched.reasonOfExclusion && formik.errors.reasonOfExclusion}
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
                  error={formik.touched.loanAccountNumber && Boolean(formik.errors.loanAccountNumber)}
                  helperText={formik.touched.loanAccountNumber && formik.errors.loanAccountNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ptpAmount"
                  name="ptpAmount"
                  label="PTP Amount"
                  value={formik.values.ptpAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.ptpAmount && Boolean(formik.errors.ptpAmount)}
                  helperText={formik.touched.ptpAmount && formik.errors.ptpAmount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ptp"
                  name="ptp"
                  label="PTP"
                  value={formik.values.ptp}
                  onChange={formik.handleChange}
                  error={formik.touched.ptp && Boolean(formik.errors.ptp)}
                  helperText={formik.touched.ptp && formik.errors.ptp}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldPtpLookupId"
                  name="oldPtpLookupId"
                  label="Old PTP Lookup Id"
                  value={formik.values.oldPtpLookupId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ratio"
                  name="ratio"
                  label="Ratio"
                  value={formik.values.ratio}
                  onChange={formik.handleChange}
                  error={formik.touched.ratio && Boolean(formik.errors.ratio)}
                  helperText={formik.touched.ratio && formik.errors.ratio}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="actualCreditorsAmount"
                  name="actualCreditorsAmount"
                  label="Actual Creditor's Amount"
                  value={formik.values.actualCreditorsAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.actualCreditorsAmount && Boolean(formik.errors.actualCreditorsAmount)}
                  helperText={formik.touched.actualCreditorsAmount && formik.errors.actualCreditorsAmount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="actionNeeded"
                  name="actionNeeded"
                  label="Action Needed"
                  value={formik.values.actionNeeded}
                  onChange={formik.handleChange}
                  error={formik.touched.actionNeeded && Boolean(formik.errors.actionNeeded)}
                  helperText={formik.touched.actionNeeded && formik.errors.actionNeeded}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="keepAmountFixed"
                  name="keepAmountFixed"
                  label="Keep Amount Fixed"
                  value={formik.values.keepAmountFixed}
                  onChange={formik.handleChange}
                  error={formik.touched.keepAmountFixed && Boolean(formik.errors.keepAmountFixed)}
                  helperText={formik.touched.keepAmountFixed && formik.errors.keepAmountFixed}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="dmpCycleNumber"
                  name="dmpCycleNumber"
                  label="DMP Cycle Number"
                  value={formik.values.dmpCycleNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.dmpCycleNumber && Boolean(formik.errors.dmpCycleNumber)}
                  helperText={formik.touched.dmpCycleNumber && formik.errors.dmpCycleNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="reasonToKeepAmountFixed"
                  name="reasonToKeepAmountFixed"
                  label="Reason to Keep Amount Fixed"
                  value={formik.values.reasonToKeepAmountFixed}
                  onChange={formik.handleChange}
                  error={formik.touched.reasonToKeepAmountFixed && Boolean(formik.errors.reasonToKeepAmountFixed)}
                  helperText={formik.touched.reasonToKeepAmountFixed && formik.errors.reasonToKeepAmountFixed}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="crtNo"
                  name="crtNo"
                  label="CRT No"
                  value={formik.values.crtNo}
                  onChange={formik.handleChange}
                  error={formik.touched.crtNo && Boolean(formik.errors.crtNo)}
                  helperText={formik.touched.crtNo && formik.errors.crtNo}
                />
              </Grid>
            </Grid>
            {/* {"  Backend Fields"} */}
            <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
              Backend Fields
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditorId"
                  name="creditorId"
                  label="Creditor Id"
                  value={formik.values.creditorId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="expectedCreditorsAmount"
                  name="expectedCreditorsAmount"
                  label="Expected Creditor's Amount"
                  value={formik.values.expectedCreditorsAmount}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditorsProfile"
                  name="creditorsProfile"
                  label="Creditor's Profile"
                  value={formik.values.creditorsProfile}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldCreditorsProfileLookupId"
                  name="oldCreditorsProfileLookupId"
                  label="Old Creditor's Profile Lookup Id"
                  value={formik.values.oldCreditorsProfileLookupId}
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
      {tabIndex === 1 && (
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Creditors Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.creditorsName}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.paymentStatus}</TableCell>
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
  );
}
