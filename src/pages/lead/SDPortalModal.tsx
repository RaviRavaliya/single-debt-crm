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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';



interface SDPortalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function SDPortalModal({ open, onClose, onSave }: SDPortalModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('sdPortalData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('sdPortalData', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    leadName: Yup.string().required('Lead Name is required'),
    title: Yup.string().required('Title is required'),
    agentComments: Yup.string().required('Agent Comments is required'),
    department: Yup.string().required('Department is required'),
    oldRecordId: Yup.string().required('Old Record ID is required'),
    uploadToWorkdrive: Yup.boolean().required('Upload to Workdrive is required'),
    sdPortalOwner: Yup.string().required('SD Portal Owner is required'),
    marketingTeam: Yup.string().required('Marketing Team is required'),
    addedBy: Yup.string().required('Added By is required'),
    clientComments: Yup.string().required('Client Comments is required'),
    status: Yup.string().required('Status is required'),
    referName: Yup.string().required('Refer Name is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      leadName: '',
      title: '',
      agentComments: '',
      department: '',
      oldRecordId: '',
      uploadToWorkdrive: false,
      sdPortalOwner: '',
      marketingTeam: '',
      addedBy: '',
      clientComments: '',
      status: '',
      referName: '',
      phoneNumber: '',
      ownerEmail: '',
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
        text: 'SD Portal details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
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
      confirmButtonText: 'Yes, delete it!',
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
        Add/Edit SD Portal Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add/Edit SD Portal Details" />
        <Tab label="View SD Portal Details" />
      </Tabs>
      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Typography variant="h4" gutterBottom>
              SD Portal Information
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
                  id="title"
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="agentComments"
                  name="agentComments"
                  label="Agent Comments"
                  value={formik.values.agentComments}
                  onChange={formik.handleChange}
                  error={formik.touched.agentComments && Boolean(formik.errors.agentComments)}
                  helperText={formik.touched.agentComments && formik.errors.agentComments}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="department"
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
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
                  id="uploadToWorkdrive"
                  name="uploadToWorkdrive"
                  label="Upload to Workdrive"
                  value={formik.values.uploadToWorkdrive}
                  onChange={formik.handleChange}
                  error={formik.touched.uploadToWorkdrive && Boolean(formik.errors.uploadToWorkdrive)}
                  helperText={formik.touched.uploadToWorkdrive && formik.errors.uploadToWorkdrive}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="sdPortalOwner"
                  name="sdPortalOwner"
                  label="SD Portal Owner"
                  value={formik.values.sdPortalOwner}
                  onChange={formik.handleChange}
                  error={formik.touched.sdPortalOwner && Boolean(formik.errors.sdPortalOwner)}
                  helperText={formik.touched.sdPortalOwner && formik.errors.sdPortalOwner}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="marketingTeam"
                  name="marketingTeam"
                  label="Marketing Team"
                  value={formik.values.marketingTeam}
                  onChange={formik.handleChange}
                  error={formik.touched.marketingTeam && Boolean(formik.errors.marketingTeam)}
                  helperText={formik.touched .marketingTeam && formik.errors.marketingTeam}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="addedBy"
                  name="addedBy"
                  label="Added By"
                  value={formik.values.addedBy}
                  onChange={formik.handleChange}
                  error={formik.touched.addedBy && Boolean(formik.errors.addedBy)}
                  helperText={formik.touched.addedBy && formik.errors.addedBy}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="clientComments"
                  name="clientComments"
                  label="Client Comments"
                  value={formik.values.clientComments}
                  onChange={formik.handleChange}
                  error={formik.touched.clientComments && Boolean(formik.errors.clientComments)}
                  helperText={formik.touched.clientComments && formik.errors.clientComments}
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
                  id="referName"
                  name="referName"
                  label="Refer Name"
                  value={formik.values.referName}
                  onChange={formik.handleChange}
                  error={formik.touched.referName && Boolean(formik.errors.referName)}
                  helperText={formik.touched.referName && formik.errors.referName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
      {tabIndex === 1 && (
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lead Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Agent Comments</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.leadName}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.agentComments}</TableCell>
                    <TableCell>{item.department}</TableCell>
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