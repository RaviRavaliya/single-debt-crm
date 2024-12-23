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
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateZohoSign({ open, onClose, onSave }: CreateTaskModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const storedData = localStorage.getItem('taskProfiles');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('taskProfiles', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    zohoSignDocumentsName: Yup.string().required('ZohoSign Documents Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    account: Yup.string().required('Account is required'),
    deal: Yup.string().required('Deal is required'),
    quote: Yup.string().required('Quote is required'),
    dateDeclined: Yup.string().required('Date Declined is required'),
    declinedReason: Yup.string().required('Declined Reason is required'),
    documentDescription: Yup.string().required('Document Description is required'),
    // previewOrPositionSignatureFields: Yup.string().required('Preview or Position Signature Fields is required'),
    zohoSignDocumentId: Yup.string().required('ZohoSign Document ID is required'),
    moduleName: Yup.string().required('Module Name is required'),
    ownerEmail: Yup.string().email('Invalid email format').required('Owner Email is required'),
    zohoSignDocumentsOwner: Yup.string().required('ZohoSign Documents Owner is required'),
    secondaryEmail: Yup.string().email('Invalid email format'),
    // emailOptOut: Yup.string(),
    contact: Yup.string().required('Contact is required'),
    lead: Yup.string().required('Lead is required'),
    dateCompleted: Yup.string(),
    dateSent: Yup.string(),
    documentDeadline: Yup.string().required('Document Deadline is required'),
    documentStatus: Yup.string().required('Document Status is required'),
    timeToComplete: Yup.string().required('Time to complete is required'),
    documentNote: Yup.string().required('Document Note is required'),
    moduleRecordId: Yup.string().required('Module Record ID is required'),
    oldRecordId: Yup.string().required('Old Record Id is required')
  });

  const formik = useFormik({
    initialValues: {
      zohoSignDocumentsName: '',
      email: '',
      account: '',
      deal: '',
      quote: '',
      dateDeclined: '',
      declinedReason: '',
      documentDescription: '',
      previewOrPositionSignatureFields: false,
      zohoSignDocumentId: '',
      moduleName: '',
      ownerEmail: '',
      zohoSignDocumentsOwner: '',
      secondaryEmail: '',
      emailOptOut: false,
      contact: '',
      lead: '',
      dateCompleted: '',
      dateSent: '',
      documentDeadline: '',
      documentStatus: 'Pending',
      timeToComplete: '',
      documentNote: '',
      moduleRecordId: '',
      oldRecordId: ''
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
        text: 'ZohoSign details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
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
        Create ZohoSign
        <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add/Edit ZohoSign" />
        <Tab label="View ZohoSign" />
      </Tabs>

      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            {/* ZohoSign Documents Information */}
            <Typography variant="h4" gutterBottom>
              ZohoSign Documents Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="zohoSignDocumentsName"
                  name="zohoSignDocumentsName"
                  label="ZohoSign Documents Name"
                  value={formik.values.zohoSignDocumentsName}
                  onChange={formik.handleChange}
                  error={formik.touched.zohoSignDocumentsName && Boolean(formik.errors.zohoSignDocumentsName)}
                  helperText={formik.touched.zohoSignDocumentsName && formik.errors.zohoSignDocumentsName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="email"
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
                  id="account"
                  name="account"
                  label="Account"
                  value={formik.values.account}
                  onChange={formik.handleChange}
                  error={formik.touched.account && Boolean(formik.errors.account)}
                  helperText={formik.touched.account && formik.errors.account}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="deal"
                  name="deal"
                  label="Deal"
                  value={formik.values.deal}
                  onChange={formik.handleChange}
                  error={formik.touched.deal && Boolean(formik.errors.deal)}
                  helperText={formik.touched.deal && formik.errors.deal}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="quote"
                  name="quote"
                  label="Quote"
                  value={formik.values.quote}
                  onChange={formik.handleChange}
                  error={formik.touched.quote && Boolean(formik.errors.quote)}
                  helperText={formik.touched.quote && formik.errors.quote}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  id="dateDeclined"
                  label="Date Declined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  {...formik.getFieldProps('dateDeclined')}
                  error={formik.touched.dateDeclined && Boolean(formik.errors.dateDeclined)}
                  helperText={formik.touched.dateDeclined && formik.errors.dateDeclined}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="declinedReason"
                  name="declinedReason"
                  label="Declined Reason"
                  value={formik.values.declinedReason}
                  onChange={formik.handleChange}
                  error={formik.touched.declinedReason && Boolean(formik.errors.declinedReason)}
                  helperText={formik.touched.declinedReason && formik.errors.declinedReason}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="documentDescription"
                  name="documentDescription"
                  label="Document Description"
                  value={formik.values.documentDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.documentDescription && Boolean(formik.errors.documentDescription)}
                  helperText={formik.touched.documentDescription && formik.errors.documentDescription}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Preview or Position Signature </Typography>
                <Switch
                  id="previewOrPositionSignatureFields"
                  name="previewOrPositionSignatureFields"
                  checked={formik.values.previewOrPositionSignatureFields}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Email Opt Out</Typography>
                <Switch id="emailOptOut" name="emailOptOut" checked={formik.values.emailOptOut} onChange={formik.handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="zohoSignDocumentId"
                  name="zohoSignDocumentId"
                  label="ZohoSign Document ID"
                  value={formik.values.zohoSignDocumentId}
                  onChange={formik.handleChange}
                  error={formik.touched.zohoSignDocumentId && Boolean(formik.errors.zohoSignDocumentId)}
                  helperText={formik.touched.zohoSignDocumentId && formik.errors.zohoSignDocumentId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="moduleName"
                  name="moduleName"
                  label="Module Name"
                  value={formik.values.moduleName}
                  onChange={formik.handleChange}
                  error={formik.touched.moduleName && Boolean(formik.errors.moduleName)}
                  helperText={formik.touched.moduleName && formik.errors.moduleName}
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
                  id="zohoSignDocumentsOwner"
                  name="zohoSignDocumentsOwner"
                  label="ZohoSign Documents Owner"
                  value={formik.values.zohoSignDocumentsOwner}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.zohoSignDocumentsOwner && Boolean(formik.errors.zohoSignDocumentsOwner)}
                  helperText={formik.touched.zohoSignDocumentsOwner && formik.errors.zohoSignDocumentsOwner}
                >
                  <MenuItem value="Marketing Team">Marketing Team</MenuItem>
                  <MenuItem value="Sales Team">Sales Team</MenuItem>
                  <MenuItem value="Support Team">Support Team</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="secondaryEmail"
                  name="secondaryEmail"
                  label="Secondary Email"
                  value={formik.values.secondaryEmail}
                  onChange={formik.handleChange}
                  error={formik.touched.secondaryEmail && Boolean(formik.errors.secondaryEmail)}
                  helperText={formik.touched.secondaryEmail && formik.errors.secondaryEmail}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="contact"
                  name="contact"
                  label="Contact"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  error={formik.touched.contact && Boolean(formik.errors.contact)}
                  helperText={formik.touched.contact && formik.errors.contact}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="lead"
                  name="lead"
                  label="Lead"
                  value={formik.values.lead}
                  onChange={formik.handleChange}
                  error={formik.touched.lead && Boolean(formik.errors.lead)}
                  helperText={formik.touched.lead && formik.errors.lead}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  id="dateCompleted"
                  label="Date Completed"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  {...formik.getFieldProps('dateCompleted')}
                  error={formik.touched.dateCompleted && Boolean(formik.errors.dateCompleted)}
                  helperText={formik.touched.dateCompleted && formik.errors.dateCompleted}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  id="dateSent"
                  label="Date Sent"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  {...formik.getFieldProps('dateSent')}
                  error={formik.touched.dateSent && Boolean(formik.errors.dateSent)}
                  helperText={formik.touched.dateSent && formik.errors.dateSent}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  id="documentDeadline"
                  label="Document Deadline"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  {...formik.getFieldProps('documentDeadline')}
                  error={formik.touched.documentDeadline && Boolean(formik.errors.documentDeadline)}
                  helperText={formik.touched.documentDeadline && formik.errors.documentDeadline}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="documentStatus"
                  name="documentStatus"
                  label="Document Status"
                  value={formik.values.documentStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.documentStatus && Boolean(formik.errors.documentStatus)}
                  helperText={formik.touched.documentStatus && formik.errors.documentStatus}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Declined">Declined</MenuItem>
                  <MenuItem value="Sent">Sent</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="timeToComplete"
                  name="timeToComplete"
                  label="Time to Complete"
                  value={formik.values.timeToComplete}
                  onChange={formik.handleChange}
                  error={formik.touched.timeToComplete && Boolean(formik.errors.timeToComplete)}
                  helperText={formik.touched.timeToComplete && formik.errors.timeToComplete}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="documentNote"
                  name="documentNote"
                  label="Document Note"
                  value={formik.values.documentNote}
                  onChange={formik.handleChange}
                  error={formik.touched.documentNote && Boolean(formik.errors.documentNote)}
                  helperText={formik.touched.documentNote && formik.errors.documentNote}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="moduleRecordId"
                  name="moduleRecordId"
                  label="Module Record ID"
                  value={formik.values.moduleRecordId}
                  onChange={formik.handleChange}
                  error={formik.touched.moduleRecordId && Boolean(formik.errors.moduleRecordId)}
                  helperText={formik.touched.moduleRecordId && formik.errors.moduleRecordId}
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
                  error={formik.touched.oldRecordId && Boolean(formik.errors.oldRecordId)}
                  helperText={formik.touched.oldRecordId && formik.errors.oldRecordId}
                />
              </Grid>
            </Grid>
          </DialogContent>
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

{/* Second Tab: ZohoSign Details */}
{tabIndex === 1 && (
  <DialogContent>
    <Typography variant="h4" gutterBottom>
      ZohoSign Details
    </Typography>
    {data.length === 0 ? (
      <Typography>No records found.</Typography>
    ) : (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ZohoSign Documents Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.zohoSignDocumentsName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.documentStatus}</TableCell>
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
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    )}
  </DialogContent>
)}

    </Dialog>
  );
}
