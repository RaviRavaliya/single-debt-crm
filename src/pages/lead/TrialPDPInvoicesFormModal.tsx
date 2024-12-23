import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  MenuItem,
  Switch,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

interface TrialPDPInvoicesFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface FormValues {
  id: string;
  trialPDPInvoicesImage: string;
  pdpInvoiceNumber: string;
  invoiceDate: Date | null;
  zohoBooksInvoiceId: string;
  invoiceLink: string;
  status: string;
  email: string;
  currency: string;
  oldRecordId: string;
  ownerEmail: string;
  trialPDPInvoicesOwner: string;
  leadName: string;
  pdpExpiryDate: Date | null;
  dueDate: Date | null;
  invoiceAmount: number;
  tax: number;
  totalAmount: number;
  paymentDate: Date | null;
  exchangeRate: number;
}

export default function TrialPDPInvoicesForm({ open, onClose, onSave }: TrialPDPInvoicesFormProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<FormValues[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const storedData = localStorage.getItem('trialPDPInvoices');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: FormValues[]) => {
    localStorage.setItem('trialPDPInvoices', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    trialPDPInvoicesImage: Yup.string().required('Trial PDP Invoices Image is required'),
    pdpInvoiceNumber: Yup.string().required('PDP Invoice Number is required'),
    invoiceDate: Yup.date().required('Invoice Date is required'),
    zohoBooksInvoiceId: Yup.string().required('Zoho Books Invoice ID is required'),
    invoiceLink: Yup.string().required('Invoice Link is required'),
    status: Yup.string().required('Status is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    currency: Yup.string().required('Currency is required'),
    oldRecordId: Yup.string().required('Old Record ID is required'),
    ownerEmail: Yup.string().email('Invalid email format').required('Owner email is required'),
    trialPDPInvoicesOwner: Yup.string().required('Trial PDP Invoices Owner is required'),
    leadName: Yup.string().required('Lead Name is required'),
    pdpExpiryDate: Yup.date().required('PDP Expiry Date is required'),
    dueDate: Yup.date().required('Due Date is required'),
    invoiceAmount: Yup.number().required('Invoice Amount is required'),
    tax: Yup.number().required('Tax is required'),
    totalAmount: Yup.number().required('Total Amount is required'),
    paymentDate: Yup.date().required('Payment Date is required'),
    exchangeRate: Yup.number().required('Exchange Rate is required')
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      id: '',
      trialPDPInvoicesImage: '',
      pdpInvoiceNumber: '',
      invoiceDate: null,
      zohoBooksInvoiceId: '',
      invoiceLink: '',
      status: '',
      email: '',
      currency: '',
      oldRecordId: '',
      ownerEmail: '',
      trialPDPInvoicesOwner: '',
      leadName: '',
      pdpExpiryDate: null,
      dueDate: null,
      invoiceAmount: 0,
      tax: 0,
      totalAmount: 0,
      paymentDate: null,
      exchangeRate: 0
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
        text: 'Trial PDP Invoices details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={onClose}
        PaperProps={{ style: { borderRadius: '16px ', padding: '16px', maxHeight: '90vh' } }}
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
          Trial PDP Invoices
          <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Add/Edit Trial PDP Invoices" />
          <Tab label="View Trial PDP Invoices" />
        </ Tabs>

        {tabIndex === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
              {/* Trial PDP Invoices Information */}
              <Typography variant="h4" gutterBottom>
                Trial PDP Invoices Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">Trial PDP Invoices Image</Typography>
                  <div
                    style={{
                      width: '120px',
                      height: ' 120px',
                      borderRadius: '50%',
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {formik.values.trialPDPInvoicesImage && typeof formik.values.trialPDPInvoicesImage === 'object' ? (
                      <img
                        src={URL.createObjectURL(formik.values.trialPDPInvoicesImage)}
                        alt="Trial PDP Invoices Image"
                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                      />
                    ) : (
                      <img src="https://via.placeholder.com/100 " alt="placeholder" style={{ borderRadius: '50%' }} />
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="pdpInvoiceNumber"
                    name="pdpInvoiceNumber"
                    label="PDP Invoice Number"
                    value={formik.values.pdpInvoiceNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.pdpInvoiceNumber && Boolean(formik.errors.pdpInvoiceNumber)}
                    helperText={formik.touched.pdpInvoiceNumber && formik.errors.pdpInvoiceNumber}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MobileDatePicker
                    label="Invoice Date"
                    value={formik.values.invoiceDate}
                    onChange={(date: Date | null) => formik.setFieldValue('invoiceDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.invoiceDate && Boolean(formik.errors.invoiceDate),
                        helperText: formik.touched.invoiceDate && formik.errors.invoiceDate
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="zohoBooksInvoiceId"
                    name="zohoBooksInvoiceId"
                    label="Zoho Books Invoice ID"
                    value={formik.values.zohoBooksInvoiceId}
                    onChange={formik.handleChange}
                    error={formik.touched.zohoBooksInvoiceId && Boolean(formik.errors.zohoBooksInvoiceId)}
                    helperText={formik.touched.zohoBooksInvoiceId && formik.errors.zohoBooksInvoiceId}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="invoiceLink"
                    name="invoiceLink"
                    label="Invoice Link"
                    value={formik.values.invoiceLink}
                    onChange={formik.handleChange}
                    error={formik.touched.invoiceLink && Boolean(formik.errors.invoiceLink)}
                    helperText={formik.touched.invoiceLink && formik.errors.invoiceLink}
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
                    id="currency"
                    name="currency"
                    label="Currency"
                    value={formik.values.currency}
                    onChange={formik.handleChange}
                    error={formik.touched.currency && Boolean(formik.errors.currency)}
                    helperText={formik.touched.currency && formik.errors.currency}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="oldRecordId"
                    name="oldRecordId"
                    label="Old Record ID"
                    value={formik.values.oldRecordId}
                    onChange={formik.handleChange}
                    error={formik.touched.oldRecordId && Boolean(formik.errors.oldRecordId)}
 helperText={formik.touched.oldRecordId && formik.errors.oldRecordId}
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
                    select
                    fullWidth
                    id="trialPDPInvoicesOwner"
                    name="trialPDPInvoicesOwner"
                    label="Trial PDP Invoices Owner"
                    value={formik.values.trialPDPInvoicesOwner}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.trialPDPInvoicesOwner && Boolean(formik.errors.trialPDPInvoicesOwner)}
                    helperText={formik.touched.trialPDPInvoicesOwner && formik.errors.trialPDPInvoicesOwner}
                  >
                    <MenuItem value="Marketing Team">Marketing Team</MenuItem>
                    <MenuItem value="Sales Team">Sales Team</MenuItem>
                    <MenuItem value="Support Team">Support Team</MenuItem>
                  </TextField>
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
                  <MobileDatePicker
                    label="PDP Expiry Date"
                    value={formik.values.pdpExpiryDate}
                    onChange={(date: Date | null) => formik.setFieldValue('pdpExpiryDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.pdpExpiryDate && Boolean(formik.errors.pdpExpiryDate),
                        helperText: formik.touched.pdpExpiryDate && formik.errors.pdpExpiryDate
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MobileDatePicker
                    label="Due Date"
                    value={formik.values.dueDate}
                    onChange={(date: Date | null) => formik.setFieldValue('dueDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                        helperText: formik.touched.dueDate && formik.errors.dueDate
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="invoiceAmount"
                    name="invoiceAmount"
                    label="Invoice Amount"
                    value={formik.values.invoiceAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.invoiceAmount && Boolean(formik.errors.invoiceAmount)}
                    helperText={formik.touched.invoiceAmount && formik.errors.invoiceAmount}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹ </InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="totalAmount"
                    name="totalAmount"
                    label="Total Amount"
                    value={formik.values.totalAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.totalAmount && Boolean(formik.errors.totalAmount)}
                    helperText={formik.touched.totalAmount && formik.errors.totalAmount}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MobileDatePicker
                    label="Payment Date"
                    value={formik.values.paymentDate}
                    onChange={(date: Date | null) => formik.setFieldValue('paymentDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.paymentDate && Boolean(formik.errors.paymentDate),
                        helperText: formik.touched.paymentDate && formik.errors.paymentDate
                      }
                    }}
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
                    error={formik.touched.exchangeRate && Boolean(formik.errors.exchangeRate)}
                    helperText={formik.touched.exchangeRate && formik.errors.exchangeRate}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: '24px' }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={onClose} variant="contained" color="error">
                Cancel
              </Button>
            </DialogActions>
          </form>
        )}
        {tabIndex === 1 && (
          <DialogContent sx={{ padding: '24px' }}>
            <Typography variant="h4" gutterBottom>
              View Trial PDP Invoices
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Trial PDP Invoices Image</TableCell>
                  <TableCell>PDP Invoice Number</TableCell>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell>Zoho Books Invoice ID</TableCell>
                  <TableCell>Invoice Link</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell> Currency</TableCell>
                  <TableCell>Old Record ID</TableCell>
                  <TableCell>Owner Email</TableCell>
                  <TableCell>Trial PDP Invoices Owner</TableCell>
                  <TableCell>Lead Name</TableCell>
                  <TableCell>PDP Expiry Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Invoice Amount</TableCell>
                  <TableCell>Tax</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Exchange Rate</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.trialPDPInvoicesImage}</TableCell>
                    <TableCell>{item.pdpInvoiceNumber}</TableCell>
                    <TableCell>{item.invoiceDate?.toString()}</TableCell>
                    <TableCell>{item.zohoBooksInvoiceId}</TableCell>
                    <TableCell>{item.invoiceLink}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.currency}</TableCell>
                    <TableCell>{item.oldRecordId}</TableCell>
                    <TableCell>{item.ownerEmail}</TableCell>
                    <TableCell>{item.trialPDPInvoicesOwner}</TableCell>
                    <TableCell>{item.leadName}</TableCell>
                    <TableCell>{item.pdpExpiryDate?.toString()}</TableCell>
                    <TableCell>{item.dueDate?.toString()}</TableCell>
                    <TableCell>{item.invoiceAmount}</TableCell>
                    <TableCell>{item.tax}</TableCell>
                    <TableCell>{item.totalAmount}</TableCell>
                    <TableCell>{item.paymentDate?.toString()}</TableCell>
                    <TableCell>{item.exchangeRate}</TableCell>
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={(event: any) => handleChangeRowsPerPage(event)}
            />
          </DialogContent>
        )}
      </Dialog>
    </LocalizationProvider>
  );
}