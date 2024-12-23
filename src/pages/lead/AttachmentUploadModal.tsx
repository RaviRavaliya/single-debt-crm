import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface AttachmentUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AttachmentUploadModal = ({ open, onClose }: AttachmentUploadModalProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('attachments');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('attachments', JSON.stringify(newData));
    setData(newData);
  };

  // Formik validation schema using Yup
  const validationSchema = Yup.object({
    oldAutonumber: Yup.number().required('Old Autonumber is required'),
    oldRecordId: Yup.string().required('Old Record ID is required'),
    lead: Yup.string().required('Lead is required'),
    ownerEmail: Yup.string().email('Invalid email format').required('Owner email is required'),
    fileUpload: Yup.mixed().required('File upload is required'),
    attachmentOwner: Yup.string().required('Attachment owner is required'),
    description: Yup.string().required('Description is required')
  });
  interface FormValues {
    oldAutonumber: string;
    oldRecordId: string;
    lead: string;
    ownerEmail: string;
    fileUpload: File | null; // Ensures fileUpload is either a File or null
    attachmentOwner: string;
    description: string;
  }
  

  const formik = useFormik<FormValues>({
    initialValues: {
      oldAutonumber: '',
      oldRecordId: '',
      lead: '',
      ownerEmail: '',
      fileUpload: null, // Initializes fileUpload as null
      attachmentOwner: 'Marketing Team',
      description: ''
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
  

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('fileUpload', file);
    } else {
      formik.setFieldValue('fileUpload', null);
    }
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

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog    fullWidth
    maxWidth="lg"
    open={open}
    onClose={onClose}
    PaperProps={{ style: { borderRadius: '16px', padding: '16px', maxHeight: '90vh' } }}>
      <DialogTitle
        sx={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          background: '#e74c3c',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px 8px 0 0'
        }}
      >
        Attachment Upload
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 22,
            top: 21,
            color: '#fff', '&:hover': { backgroundColor: '#e74c3c' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="attachment tabs" centered>
          <Tab label="Upload Attachment" />
          <Tab label="Attachment List" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Attachment Image */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Attachment Image</Typography>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {formik.values.fileUpload && formik.values.fileUpload instanceof File ? (
                    <img
                      src={URL.createObjectURL(formik.values.fileUpload)}
                      alt="Attachment"
                      style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                    />
                  ) : (
                    <img src="https://via.placeholder.com/100" alt="placeholder" style={{ borderRadius: '50%' }} />
                  )}
                </div>
              </Grid>

              {/* File Upload */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">File Upload</Typography>
                <Button variant="contained" component="label">
                  Choose File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {formik.errors.fileUpload && formik.touched.fileUpload && (
                  <Typography variant="body2" color="error">
                    {formik.errors.fileUpload}
                  </Typography>
                )}
              </Grid>
              {/* Old Autonumber */}
              <Grid item xs={12} md={6}>
                <TextField
                  type="number"
                  fullWidth
                  label="Old Autonumber"
                  name="oldAutonumber"
                  value={formik.values.oldAutonumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.oldAutonumber && Boolean(formik.errors.oldAutonumber)}
                  helperText={formik.touched.oldAutonumber && formik.errors.oldAutonumber}
                />
              </Grid>

              {/* Old Record ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Old Record ID"
                  name="oldRecordId"
                  value={formik.values.oldRecordId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.oldRecordId && Boolean(formik.errors.oldRecordId)}
                  helperText={formik.touched.oldRecordId && formik.errors.oldRecordId}
                />
              </Grid>

              {/* Lead */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lead"
                  name="lead"
                  value={formik.values.lead}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lead && Boolean(formik.errors.lead)}
                  helperText={formik.touched.lead && formik.errors.lead}
                />
              </Grid>

              {/* Owner Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Owner Email"
                  name="ownerEmail"
                  value={formik.values.ownerEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ownerEmail && Boolean(formik.errors.ownerEmail)}
                  helperText={formik.touched.ownerEmail && formik.errors.ownerEmail}
                />
              </Grid>

              {/* Attachment Upload Owner */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Attachment Upload Owner"
                  name="attachmentOwner"
                  value={formik.values.attachmentOwner}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.attachmentOwner && Boolean(formik.errors.attachmentOwner)}
                  helperText={formik.touched.attachmentOwner && formik.errors.attachmentOwner}
                >
                  <MenuItem value="Marketing Team">Marketing Team</MenuItem>
                  <MenuItem value="Sales Team">Sales Team</MenuItem>
                  <MenuItem value="Support Team">Support Team</MenuItem>
                </TextField>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
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
                  <TableCell>ID</TableCell>
                  <TableCell>Old Autonumber</TableCell>
                  <TableCell>Old Record ID</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Owner Email</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((attachment) => (
                  <TableRow key={attachment.id}>
                    <TableCell>{attachment.id}</TableCell>
                    <TableCell>{attachment.oldAutonumber}</TableCell>
                    <TableCell>{attachment.oldRecordId}</TableCell>
                    <TableCell>{attachment.lead}</TableCell>
                    <TableCell>{attachment.ownerEmail}</TableCell>
                    <TableCell>{attachment.attachmentOwner}</TableCell>
                    <TableCell>{attachment.description}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(attachment.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(attachment.id)} color="error">
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
};

export default AttachmentUploadModal;
