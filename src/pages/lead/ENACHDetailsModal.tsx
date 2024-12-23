import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
interface ENACHDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface ENACHDetails {
  id: string;
  deductAmount: string;
  transactionID: string;
  instructionID: string;
  transactionStatus: string;
  deductionDate: Date | string | null;
  enachCreatedOn: Date | string | null;
  enachCustomer: string;
  errorStatus: string;
  umrnNo: string;
  enachFailureReason: string;
  originalDeductionDate: Date | string | null;
}

export default function ENACHDetailsModal({ open, onClose, onSave }: ENACHDetailsModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<ENACHDetails[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('enachDetails');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: ENACHDetails[]) => {
    localStorage.setItem('enachDetails', JSON.stringify(newData));
    setData(newData);
  };

  // State to hold dynamic values for input fields
  const [transactionIDValue, setTransactionIDValue] = useState('');
  const [instructionIDValue, setInstructionIDValue] = useState('');

  // Generate random strings when the component mounts
  useEffect(() => {
    setTransactionIDValue(uuidv4());
    setInstructionIDValue(uuidv4());
  }, []);

  const validationSchema = Yup.object({
    deductAmount: Yup.number().required('Deduct Amount is required'),
    transactionID: Yup.string().required('Transaction ID is required'),
    instructionID: Yup.string().required('Instruction ID is required'),
    transactionStatus: Yup.string().required('Transaction Status is required'),
    deductionDate: Yup.date().required('Deduction Date is required'),
    enachCreatedOn: Yup.date().required('ENACH Created On is required'),
    enachCustomer: Yup.string().required('ENACH Customer is required'),
    errorStatus: Yup.string().required('Error Status is required'),
    umrnNo: Yup.number().required('UMRN No is required'),
    enachFailureReason: Yup.string().required('ENACH Failure Reason is required'),
    originalDeductionDate: Yup.date().required('Original Deduction Date is required')
  });

  const formik = useFormik({
    initialValues: {
      deductAmount: '',
      transactionID: '',
      instructionID: '',
      transactionStatus: '',
      deductionDate: new Date(),
      enachCreatedOn: new Date(),
      enachCustomer: '',
      errorStatus: '',
      umrnNo: '',
      enachFailureReason: '',
      originalDeductionDate: new Date()
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = editingId
        ? data.map((item) => (item.id === editingId ? { ...values, id: editingId } : item))
        : [...data, { ...values, id: new Date().toISOString() }];

      handleSave(updatedData);
      formik.resetForm();
      setEditingId(null);
      setTabIndex(1); // Switch to view tab after saving
      onClose();
      onSave(values);
      // Show Swal success alert
      Swal.fire({
        title: 'Success!',
        text: 'ENACH details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  // Update Formik values when state changes
  useEffect(() => {
    formik.setFieldValue('transactionID', transactionIDValue);
    formik.setFieldValue('instructionID', instructionIDValue);
  }, [transactionIDValue, instructionIDValue]);

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues({
        ...item,
        deductionDate: item.deductionDate ? new Date(item.deductionDate) : new Date(),
        enachCreatedOn: item.enachCreatedOn ? new Date(item.enachCreatedOn) : new Date(),
        originalDeductionDate: item.originalDeductionDate ? new Date(item.originalDeductionDate) : new Date()
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
          Add/View ENACH Details
          <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add/Edit ENACH Details" />
          <Tab label="View ENACH Details" />
        </Tabs>
        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="deductAmount"
                    name="deductAmount"
                    label="Deduct Amount (₹)"
                    type="number"
                    value={formik.values.deductAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.deductAmount && Boolean(formik.errors.deductAmount)}
                    helperText={formik.touched.deductAmount ? formik.errors.deductAmount : ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    fullWidth
                    id={`transactionID-${uuidv4()}`} // Dynamic ID for Transaction ID
                    name="transactionID"
                    label="Transaction ID"
                    value={formik.values.transactionID}
                    onChange={formik.handleChange}
                    error={formik.touched.transactionID && Boolean(formik.errors.transactionID)}
                    helperText={formik.touched.transactionID ? formik.errors.transactionID : ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="text"
                    id={`instructionID-${uuidv4()}`} // Dynamic ID for Instruction ID
                    name="instructionID"
                    label="Instruction ID"
                    value={formik.values.instructionID}
                    onChange={formik.handleChange}
                    error={formik.touched.instructionID && Boolean(formik.errors.instructionID)}
                    helperText={formik.touched.instructionID ? formik.errors.instructionID : ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    id="transactionStatus"
                    name="transactionStatus"
                    label="Transaction Status"
                    value={formik.values.transactionStatus}
                    onChange={formik.handleChange}
                    error={formik.touched.transactionStatus && Boolean(formik.errors.transactionStatus)}
                    helperText={formik.touched.transactionStatus ? formik.errors.transactionStatus : ''}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Deduction Date"
                    value={formik.values.deductionDate}
                    onChange={(newValue) => formik.setFieldValue('deductionDate', newValue || new Date())}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="ENACH Created On"
                    value={formik.values.enachCreatedOn}
                    onChange={(newValue) => formik.setFieldValue('enachCreatedOn', newValue || new Date())}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="enachCustomer"
                    name="enachCustomer"
                    label="ENACH Customer"
                    value={formik.values.enachCustomer}
                    onChange={formik.handleChange}
                    error={formik.touched.enachCustomer && Boolean(formik.errors.enachCustomer)}
                    helperText={formik.touched.enachCustomer ? formik.errors.enachCustomer : ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    id="errorStatus"
                    name="errorStatus"
                    label="Error Status"
                    value={formik.values.errorStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.errorStatus && Boolean(formik.errors.errorStatus)}
                    helperText={formik.touched.errorStatus ? formik.errors.errorStatus : ''}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    fullWidth
                    id="umrnNo"
                    name="umrnNo"
                    label="UMRN No"
                    value={formik.values.umrnNo}
                    onChange={formik.handleChange}
                    error={formik.touched.umrnNo && Boolean(formik.errors.umrnNo)}
                    helperText={formik.touched.umrnNo ? formik.errors.umrnNo : ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                  type='text'
                    fullWidth
                    id="enachFailureReason"
                    name="enachFailureReason"
                    label="ENACH Failure Reason"
                    value={formik.values.enachFailureReason}
                    onChange={formik.handleChange}
                    error={formik.touched.enachFailureReason && Boolean(formik.errors.enachFailureReason)}
                    helperText={formik.touched.enachFailureReason ? formik.errors.enachFailureReason : ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Original Deduction Date"
                    value={formik.values.originalDeductionDate}
                    onChange={(newValue) => formik.setFieldValue('originalDeductionDate', newValue || new Date())}
                    slotProps={{ textField: { fullWidth: true } }}
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
                    <TableCell>Deduct Amount</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Instruction ID</TableCell>
                    <TableCell>Transaction Status</TableCell>
                    <TableCell>Deduction Date</TableCell>
                    <TableCell>ENACH Created On</TableCell>
                    <TableCell>ENACH Customer</TableCell>
                    <TableCell>Error Status</TableCell>
                    <TableCell>UMRN No</TableCell>
                    <TableCell>Failure Reason</TableCell>
                    <TableCell>Original Deduction Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.deductAmount}</TableCell>
                      <TableCell>{item.transactionID}</TableCell>
                      <TableCell>{item.instructionID}</TableCell>
                      <TableCell>{item.transactionStatus}</TableCell>
                      <TableCell>{item.deductionDate ? new Date(item.deductionDate).toLocaleString() : ''}</TableCell>
                      <TableCell>{item.enachCreatedOn ? new Date(item.enachCreatedOn).toLocaleString() : ''}</TableCell>
                      <TableCell>{item.enachCustomer}</TableCell>
                      <TableCell>{item.errorStatus}</TableCell>
                      <TableCell>{item.umrnNo}</TableCell>
                      <TableCell>{item.enachFailureReason}</TableCell>
                      <TableCell>{item.originalDeductionDate ? new Date(item.originalDeductionDate).toLocaleDateString() : ''}</TableCell>
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
