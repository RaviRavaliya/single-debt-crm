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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  MenuItem,
  Typography,
  TablePagination
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';

interface DMPDetailModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const DMPDetailModal = ({ open, onClose, onSave }: DMPDetailModalProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('dmpDetails');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('dmpDetails', JSON.stringify(newData));
    setData(newData);
  };

  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': [], // for CSV files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], // for XLSX files
      'application/vnd.ms-excel': [] // for older Excel files (.xls)
    }
  });

  const validationSchema = Yup.object({
    leadName: Yup.string().required('Lead Name is required'),
    creditorRecordOwner: Yup.string().required('Creditor Record Owner is required'),
    creditorsName: Yup.string().required('Creditors Name is required'),
    paymentStatus: Yup.string().required('Payment Status is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    status: Yup.string().required('Status is required'),
    typeOfCredit: Yup.string().required('Type of credit is required'),
    offerLetterDate: Yup.date().required('Offer Letter Date is required'),
    creditorPaymentPendingReason: Yup.string().required('Creditor Payment Pending Reason is required'),
    modifiedBy: Yup.string().required('Modified By is required'),
    createdBy: Yup.string().required('Created By is required'),
    totalDebtAmount: Yup.number().required('Total Debt Amount is required').min(0, 'Must be greater than or equal to 0'),
    remainingDebtAmount: Yup.number().required('Remaining Debt Amount is required').min(0, 'Must be greater than or equal to 0'),
    actualCreditorsAmount: Yup.number().required("Actual Creditor's Amount is required").min(0, 'Must be greater than or equal to 0'),
    paidAmount: Yup.number().required('Paid Amount is required').min(0, 'Must be greater than or equal to 0'),
    loanAccountNumber: Yup.string().required('Loan Account Number is required'),
    keepAmountFixed: Yup.boolean().required('Keep Amount Fixed is required'),
    actionNeeded: Yup.string().required('Action Needed is required'),
    dmpCycleNumber: Yup.string().required('DMP Cycle Number is required'),
    ptpAmount: Yup.number().required('PTP Amount is required').min(0, 'Must be greater than or equal to 0'),
    ptp: Yup.string().required('PTP is required'),
    crtNo: Yup.string().required('CRT No is required'),
    expectedCreditorsAmount: Yup.number().required("Expected Creditor's Amount is required").min(0, 'Must be greater than or equal to 0 ')
  });

  const formik = useFormik({
    initialValues: {
      leadName: '',
      creditorRecordOwner: '',
      creditorsName: '',
      paymentStatus: '',
      accountNumber: '',
      status: '',
      typeOfCredit: '',
      offerLetterDate: null,
      creditorPaymentPendingReason: '',
      modifiedBy: '',
      createdBy: '',
      totalDebtAmount: '',
      remainingDebtAmount: '',
      actualCreditorsAmount: '',
      paidAmount: '',
      loanAccountNumber: '',
      keepAmountFixed: false,
      actionNeeded: '',
      dmpCycleNumber: '',
      ptpAmount: '',
      ptp: '',
      crtNo: '',
      expectedCreditorsAmount: ''
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
        text: 'DMP details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues({
        ...item,
        offerLetterDate: item.offerLetterDate ? new Date(item.offerLetterDate) : null
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
        const updatedData = data.filter((item) => item.id !== id);
        handleSave(updatedData);
        Swal.fire('Deleted!', 'Your entry has been deleted.', 'success');
      }
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            alignItems: 'center'
          }}
        >
          Add/View DMP Payout Details
          <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add/Edit DMP Details" />
          <Tab label="View DMP Details" />
        </Tabs>
        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              <Typography variant="h3" gutterBottom>
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
                    id="creditorRecordOwner"
                    name="creditorRecordOwner"
                    label="Creditor Record Owner"
                    value={formik.values.creditorRecordOwner}
                    onChange={formik.handleChange}
                    error={formik.touched.creditorRecordOwner && Boolean(formik.errors.creditorRecordOwner)}
                    helperText={formik.touched.creditorRecordOwner && formik.errors.creditorRecordOwner}
                  />
                </Grid>
              </Grid>

              <Typography variant="h3" gutterBottom sx={{ marginTop: '24px' }}>
                Creditor Record Information
              </Typography>
              <Grid container spacing={2}>
                {/* Creditor Record Information Section */}
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
                    id="typeOfCredit"
                    name="typeOfCredit"
                    label="Type of credit"
                    value={formik.values.typeOfCredit}
                    onChange={formik.handleChange}
                    error={formik.touched.typeOfCredit && Boolean(formik.errors.typeOfCredit)}
                    helperText={formik.touched.typeOfCredit && formik.errors.typeOfCredit}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Offer Letter Date"
                    value={formik.values.offerLetterDate}
                    onChange={(newValue) => formik.setFieldValue('offerLetterDate', newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
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
                    id="modifiedBy"
                    name="modifiedBy"
                    label="Modified By"
                    value={formik.values.modifiedBy}
                    onChange={formik.handleChange}
                    error={formik.touched.modifiedBy && Boolean(formik.errors.modifiedBy)}
                    helperText={formik.touched.modifiedBy && formik.errors.modifiedBy}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="createdBy"
                    name="createdBy"
                    label="Created By"
                    value={formik.values.createdBy}
                    onChange={formik.handleChange}
                    error={formik.touched.createdBy && Boolean(formik.errors.createdBy)}
                    helperText={formik.touched.createdBy && formik.errors.createdBy}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="totalDebtAmount"
                    name="totalDebtAmount"
                    label="Total Debt Amount"
                    type="number"
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
                    type="number"
                    value={formik.values.remainingDebtAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.remainingDebtAmount && Boolean(formik.errors.remainingDebtAmount)}
                    helperText={formik.touched.remainingDebtAmount && formik.errors.remainingDebtAmount}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="actualCreditorsAmount"
                    name="actualCreditorsAmount"
                    label="Actual Creditor's Amount"
                    type="number"
                    value={formik.values.actualCreditorsAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.actualCreditorsAmount && Boolean(formik.errors.actualCreditorsAmount)}
                    helperText={formik.touched.actualCreditorsAmount && formik.errors.actualCreditorsAmount}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="paidAmount"
                    name="paidAmount"
                    label="Paid Amount"
                    type="number"
                    value={formik.values.paidAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.paidAmount && Boolean(formik.errors.paidAmount)}
                    helperText={formik.touched.paidAmount && formik.errors.paidAmount}
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
                    id="keepAmountFixed"
                    name="keepAmountFixed"
                    label="Keep Amount Fixed"
                    type="boolean"
                    value={formik.values.keepAmountFixed}
                    onChange={formik.handleChange}
                    error={formik.touched.keepAmountFixed && Boolean(formik.errors.keepAmountFixed)}
                    helperText={formik.touched.keepAmountFixed && formik.errors.keepAmountFixed}
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
                    id="ptpAmount"
                    name="ptpAmount"
                    label="PTP Amount"
                    type="number"
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
                    id="crtNo"
                    name="crtNo"
                    label="CRT No"
                    value={formik.values.crtNo}
                    onChange={formik.handleChange}
                    error={formik.touched.crtNo && Boolean(formik.errors.crtNo)}
                    helperText={formik.touched.crtNo && formik.errors.crtNo}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="expectedCreditorsAmount"
                    name="expected CreditorsAmount"
                    label="Expected Creditor's Amount"
                    type="number"
                    value={formik.values.expectedCreditorsAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.expectedCreditorsAmount && Boolean(formik.errors.expectedCreditorsAmount)}
                    helperText={formik.touched.expectedCreditorsAmount && formik.errors.expectedCreditorsAmount}
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
                    <TableCell>Lead Name</TableCell>
                    <TableCell>Creditor Record Owner</TableCell>
                    <TableCell>Creditors Name</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Account Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Type of credit</TableCell>
                    <TableCell>Offer Letter Date</TableCell>
                    <TableCell>Creditor Payment Pending Reason</TableCell>
                    <TableCell>Modified By</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Total Debt Amount</TableCell>
                    <TableCell>Remaining Debt Amount</TableCell>
                    <TableCell>Actual Creditor's Amount</TableCell>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell>Loan Account Number</TableCell>
                    <TableCell>Keep Amount Fixed</TableCell>
                    <TableCell>Action Needed</TableCell>
                    <TableCell>DMP Cycle Number</TableCell>
                    <TableCell>PTP Amount</TableCell>
                    <TableCell>PTP</TableCell>
                    <TableCell>CRT No</TableCell>
                    <TableCell>Expected Creditor's Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.leadName}</TableCell>
                      <TableCell>{item.creditorRecordOwner}</TableCell>
                      <TableCell>{item.creditorsName}</TableCell>
                      <TableCell>{item.paymentStatus}</TableCell>
                      <TableCell>{item.accountNumber}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.typeOfCredit}</TableCell>
                      <TableCell>{item.offerLetterDate ? new Date(item.offerLetterDate).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{item.creditorPaymentPendingReason}</TableCell>
                      <TableCell>{item.modifiedBy}</TableCell>
                      <TableCell>{item.createdBy}</TableCell>
                      <TableCell>{item.totalDebtAmount}</TableCell>
                      <TableCell>{item.remainingDebtAmount}</TableCell>
                      <TableCell>{item.actualCreditorsAmount}</TableCell>
                      <TableCell>{item.paidAmount}</TableCell>
                      <TableCell>{item.loanAccountNumber}</TableCell>
                      <TableCell>{item.keepAmountFixed}</TableCell>
                      <TableCell>{item.actionNeeded}</TableCell>
                      <TableCell>{item.dmpCycleNumber}</TableCell>
                      <TableCell>{item.ptpAmount}</TableCell>
                      <TableCell>{item.ptp}</TableCell>
                      <TableCell>{item.crtNo}</TableCell>
                      <TableCell>{item.expectedCreditorsAmount}</TableCell>
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
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </DialogContent>
        )}
      </Dialog>
    </LocalizationProvider>
  );
};

export default DMPDetailModal;
