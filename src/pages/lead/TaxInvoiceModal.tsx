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
  TablePagination,
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


interface CreateInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateInvoiceModal({ open, onClose, onSave }: CreateInvoiceModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const storedData = localStorage.getItem('invoiceDetails');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('invoiceDetails', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    invoiceNumber: Yup.string().required('Invoice Number is required'),
    invoiceSentDate: Yup.date().required('Invoice Sent Date is required'),
    invoiceDate: Yup.date().required('Invoice Date is required'),
    dueDate: Yup.date().required('Due Date is required'),
    paymentDate: Yup.date().required('Payment Date is required'),
    paymentMade: Yup.string().required('Payment Made is required'),
    balanceDue: Yup.number().required('Balance Due is required').min(0, 'Must be greater than or equal to 0'),
    status: Yup.string().required('Status is required'),
    paymentNumber: Yup.string().required('Payment Number is required'),
    paymentURL: Yup.string().url('Enter a valid URL').required('Payment URL is required'),
    subTotal: Yup.number().required('Sub Total is required').min(0, 'Must be greater than or equal to 0'),
    tax: Yup.number().required('Tax is required').min(0, 'Must be greater than or equal to 0'),
    grandTotal: Yup.number().required('Grand Total is required').min(0, 'Must be greater than or equal to 0'),
    creditorsAmount: Yup.number().required('Creditors Amount is required').min(0, 'Must be greater than or equal to 0'),
    managementFee: Yup.number().required('Management Fee is required').min(0, 'Must be greater than or equal to 0'),
    managementFeesInclusiveTaxes: Yup.number().required('Management Fees Inclusive Taxes is required').min(0, 'Must be greater than or equal to 0'),
    managementFeesExclusiveTaxes: Yup.number().required('Management Fees Exclusive of Taxes is required').min(0, 'Must be greater than or equal to 0'),
    reportingCreditorAmount: Yup.number().required('Reporting - Creditor Amount is required').min(0, 'Must be greater than or equal to 0'),
    creditorAmountPaidByClient: Yup.number().required('Creditor Amount Paid by Client is required').min(0, 'Must be greater than or equal to 0'),
    description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: {
      invoiceNumber: '',
      invoiceSentDate: null,
      invoiceDate: null,
      dueDate: null,
      paymentDate: null,
      paymentMade: '',
      balanceDue: '',
      status: '',
      paymentNumber: '',
      paymentURL: '',
      subTotal: '',
      tax: '',
      grandTotal: '',
      creditorsAmount: '',
      managementFee: '',
      managementFeesInclusiveTaxes: '',
      managementFeesExclusiveTaxes: '',
      reportingCreditorAmount: '',
      creditorAmountPaidByClient: '',
      description: '',
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
        text: 'Invoice details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
  });

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues({
        ...item,
        invoiceSentDate: item.invoiceSentDate ? new Date(item.invoiceSentDate) : null,
        invoiceDate: item.invoiceDate ? new Date(item.invoiceDate) : null,
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
        paymentDate: item.paymentDate ? new Date(item.paymentDate) : null,
      });
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
      confirmButtonText: 'Yes, delete it!',
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
            alignItems: 'center',
          }}
        >
          Add/View Invoice Details
          <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add/Edit Invoice Details" />
          <Tab label="View Invoice Details" />
        </Tabs>
        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              <Typography variant="h3" gutterBottom>
                Invoice Details
              </Typography>
              <Grid container spacing={2}>
                {/* Invoice Details Section */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="invoiceNumber"
                    name="invoiceNumber"
                    label="Invoice Number"
                    value={formik.values.invoiceNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
                    helperText={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Invoice Sent Date"
                    value={formik.values.invoiceSentDate}
                    onChange={(newValue) => formik.setFieldValue('invoiceSentDate', newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Invoice Date"
                    value={formik.values.invoiceDate}
                    onChange={(newValue) => formik.setFieldValue('invoiceDate', newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Due Date"
                    value={formik.values.dueDate}
                    onChange={(newValue) => formik.setFieldValue('dueDate', newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Payment Date"
                    value={formik.values.paymentDate}
                    onChange={(newValue) => formik.setFieldValue('paymentDate', newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="balanceDue"
                    name="balanceDue"
                    label="Balance Due"
                    type="number"
                    value={formik.values.balanceDue}
                    onChange={formik.handleChange}
                    error={formik.touched.balanceDue && Boolean(formik.errors.balanceDue)}
                    helperText={formik.touched.balanceDue && formik.errors.balanceDue}
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
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="paymentNumber"
                    name="paymentNumber"
                    label="Payment Number"
                    value={formik.values.paymentNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.paymentNumber && Boolean(formik.errors.paymentNumber)}
                    helperText={formik.touched.paymentNumber && formik.errors.paymentNumber}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="paymentURL"
                    name="paymentURL"
                    label="Payment URL"
                    value={formik.values.paymentURL}
                    onChange={formik.handleChange}
                    error={formik.touched.paymentURL && Boolean(formik.errors.paymentURL)}
                    helperText={formik.touched.paymentURL && formik.errors.paymentURL}
                  />
                </Grid>
              </Grid>

              <Typography variant="h3" gutterBottom sx={{ marginTop: '24px' }}>
                Price Details
              </Typography>
              <Grid container spacing={2}>
                {/* Price Details Section */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="subTotal"
                    name="subTotal"
                    label="Sub Total"
                    type="number"
                    value={formik.values.subTotal}
                    onChange={formik.handleChange}
                    error={formik.touched.subTotal && Boolean(formik.errors.subTotal)}
                    helperText={formik.touched.subTotal && formik.errors.subTotal}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="tax"
                    name="tax"
                    label="Tax"
                    type="number"
                    value={formik.values.tax}
                    onChange={formik.handleChange}
                    error={formik.touched.tax && Boolean(formik.errors.tax)}
                    helperText={formik.touched.tax && formik.errors.tax}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="grandTotal"
                    name="grandTotal"
                    label="Grand Total"
                    type="number"
                    value={formik.values.grandTotal}
                    onChange={formik.handleChange}
                    error={formik.touched.grandTotal && Boolean(formik.errors.grandTotal)}
                    helperText={formik.touched.grandTotal && formik.errors.grandTotal}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="creditorsAmount"
                    name="creditorsAmount"
                    label="Creditors Amount"
                    type="number"
                    value={formik.values.creditorsAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.creditorsAmount && Boolean(formik.errors.creditorsAmount)}
                    helperText={formik.touched.creditorsAmount && formik.errors.creditorsAmount}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="managementFee"
                    name="managementFee"
                    label="Management Fee"
                    type="number"
                    value={formik.values.managementFee}
                    onChange={formik.handleChange}
                    error={formik.touched.managementFee && Boolean(formik.errors.managementFee)}
                    helperText={formik.touched.managementFee && formik.errors.managementFee}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="managementFeesInclusiveTaxes"
                    name="managementFeesInclusiveTaxes"
                    label="Management Fees Inclusive Taxes"
                    type="number"
                    value={formik.values.managementFeesInclusiveTaxes}
                    onChange={formik.handleChange}
                    error={formik.touched.managementFeesInclusiveTaxes && Boolean(formik.errors.managementFeesInclusiveTaxes)}
                    helperText={formik.touched.managementFeesInclusiveTaxes && formik.errors.managementFeesInclusiveTaxes}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="managementFeesExclusiveTaxes"
                    name="managementFeesExclusiveTaxes"
                    label="Management Fees Exclusive of Taxes"
                    type="number"
                    value={formik.values.managementFeesExclusiveTaxes}
                    onChange={formik.handleChange}
                    error={formik.touched.managementFeesExclusiveTaxes && Boolean(formik.errors.managementFeesExclusiveTaxes)}
                    helperText={formik.touched.managementFeesExclusiveTaxes && formik.errors.managementFeesExclusiveTaxes}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="reportingCreditorAmount"
                    name="reportingCreditorAmount"
                    label="Reporting - Creditor Amount"
                    type="number"
                    value={formik.values.reportingCreditorAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.reportingCreditorAmount && Boolean(formik.errors.reportingCreditorAmount)}
                    helperText={formik.touched.reportingCreditorAmount && formik.errors.reportingCreditorAmount}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="creditorAmountPaidByClient"
                    name="creditorAmountPaidByClient"
                    label="Creditor Amount Paid by Client"
                    type="number"
                    value={formik.values.creditorAmountPaidByClient}
                    onChange={formik.handleChange}
                    error={formik.touched.creditorAmountPaidByClient && Boolean(formik.errors.creditorAmountPaidByClient)}
                    helperText={formik.touched.creditorAmountPaidByClient && formik.errors.creditorAmountPaidByClient}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
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
                    backgroundColor: '#c0392b',
                  },
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
                    backgroundColor: '#2980b9',
                  },
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
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Invoice Sent Date</TableCell>
                    <TableCell>Invoice Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Payment Made</TableCell>
                    <TableCell>Balance Due</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.invoiceNumber}</TableCell>
                      <TableCell>{item.invoiceSentDate ? new Date(item.invoiceSentDate).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{item.invoiceDate ? new Date(item.invoiceDate).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{item.paymentMade}</TableCell>
                      <TableCell>{item.balanceDue}</TableCell>
                      <TableCell>{item.status}</TableCell>
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
}
