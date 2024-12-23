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

interface WhatsAppMessagesFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const WhatsAppMessagesForm = ({ open, onClose }: WhatsAppMessagesFormProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('whatsappMessages');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('whatsappMessages', JSON.stringify(newData));
    setData(newData);
  };

  // Formik validation schema using Yup
  const validationSchema = Yup.object({
    whatsappMessagesImage: Yup.string().required('WhatsApp Messages Image is required'),
    whatsappMessagesInformation: Yup.string().required('WhatsApp Messages Information is required'),
    whatsappMessagesName: Yup.string().required('WhatsApp Messages Name is required'),
    message: Yup.string().required('Message is required'),
    mediaType: Yup.string().required('Media Type is required'),
    direction: Yup.string().required('Direction is required'),
    contact: Yup.string().required('Contact is required'),
    status: Yup.string().required('Status is required'),
    to: Yup.string().required('To is required'),
    specificBACStatus: Yup.string().required('Specific BAC Status is required'),
    messageFirst255Characters: Yup.string().required('Message-First 255 characters is required'),
    remindTime: Yup.string().required('Remind Time is required'),
    whatsappLabel: Yup.string().required('WhatsApp Label is required'),
    whatsappMessagesOwner: Yup.string().required('WhatsApp Messages Owner is required'),
    mediaName: Yup.string().required('Media Name is required'),
    media: Yup.string().required('Media is required'),
    lead: Yup.string().required('Lead is required'),
    messageTime: Yup.string().required('Message Time is required'),
    from: Yup.string().required('From is required'),
    bagAChatMessageId: Yup.string().required('BagAChat MessageId is required'),
    bagAChatLinkedWANumber: Yup.string().required('BagAChat Linked WA Number is required'),
    ownerEmail: Yup.string().email('Invalid email format').required('Owner email is required'),
    oldRecordId: Yup.string().required('Old Record ID is required'),
    whatsappType: Yup.string().required('WhatsApp Type is required')
  });

  interface FormValues {
    whatsappMessagesImage: string;
    whatsappMessagesInformation: string;
    whatsappMessagesName: string;
    message: string;
    mediaType: string;
    direction: string;
    contact: string;
    status: string;
    to: string;
    specificBACStatus: string;
    messageFirst255Characters: string;
    remindTime: string;
    whatsappLabel: string;
    whatsappMessagesOwner: string;
    mediaName: string;
    media: string;
    lead: string;
    messageTime: string;
    from: string;
    bagAChatMessageId: string;
    bagAChatLinkedWANumber: string;
    ownerEmail: string;
    oldRecordId: string;
    whatsappType: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      whatsappMessagesImage: '',
      whatsappMessagesInformation: '',
      whatsappMessagesName: '',
      message: '',
      mediaType: '',
      direction: '',
      contact: '',
      status: '',
      to: '',
      specificBACStatus: '',
      messageFirst255Characters: '',
      remindTime: '',
      whatsappLabel: '',
      whatsappMessagesOwner: '',
      mediaName: '',
      media: '',
      lead: '',
      messageTime: '',
      from: '',
      bagAChatMessageId: '',
      bagAChatLinkedWANumber: '',
      ownerEmail: '',
      oldRecordId: '',
      whatsappType: ''
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
        text: 'WhatsApp message details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('media', file);
    } else {
      formik.setFieldValue('media', null);
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
          borderRadius: '8px 8px 0 0'
        }}
      >
        WhatsApp Messages
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 22,
            top: 21,
            color: '#fff',
            '&:hover': { backgroundColor: '#e74c3c' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="whatsapp tabs" centered>
          <Tab label="Create WhatsApp Message" />
          <Tab label="WhatsApp Messages List" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              {/* WhatsApp Messages Image */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">WhatsApp Messages Image</Typography>
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
                  {formik.values.media &&
                  typeof formik.values.media === 'object' &&
                  'name' in formik.values.media &&
                  'size' in formik.values.media &&
                  'type' in formik.values.media ? (
                    <img
                      src={URL.createObjectURL(formik.values.media)}
                      alt="WhatsApp Messages Image"
                      style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                    />
                  ) : (
                    <img src="https://via.placeholder.com/100 " alt="placeholder" style={{ borderRadius: '50%' }} />
                  )}
                </div>
              </Grid>

              {/* Media */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Media</Typography>
                <Button variant="contained" component="label">
                  Choose File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {formik.errors.media && formik.touched.media && (
                  <Typography variant="body2" color="error">
                    {formik.errors.media}
                  </Typography>
                )}
              </Grid>

              {/* WhatsApp Messages Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WhatsApp Messages Information"
                  name="whatsappMessagesInformation"
                  value={formik.values.whatsappMessagesInformation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.whatsappMessagesInformation && Boolean(formik.errors.whatsappMessagesInformation)}
                  helperText={formik.touched.whatsappMessagesInformation && formik.errors.whatsappMessagesInformation}
                />
              </Grid>

              {/* WhatsApp Messages Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WhatsApp Messages Name"
                  name="whatsappMessagesName"
                  value={formik.values.whatsappMessagesName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.whatsappMessagesName && Boolean(formik.errors.whatsappMessagesName)}
                  helperText={formik.touched.whatsappMessagesName && formik.errors.whatsappMessagesName}
                />
              </Grid>

              {/* Message */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                />
              </Grid>

              {/* Media Type */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Media Type"
                  name="mediaType"
                  value={formik.values.mediaType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mediaType && Boolean(formik.errors.mediaType)}
                  helperText={formik.touched.mediaType && formik.errors.mediaType}
                />
              </Grid>

              {/* Direction */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Direction"
                  name="direction"
                  value={formik.values.direction}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.direction && Boolean(formik.errors.direction)}
                  helperText={formik.touched.direction && formik.errors.direction}
                />
              </Grid>

              {/* Contact */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact"
                  name="contact"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.contact && Boolean(formik.errors.contact)}
                  helperText={formik.touched.contact && formik.errors.contact}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                />
              </Grid>

              {/* To */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="To"
                  name="to"
                  value={formik.values.to}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.to && Boolean(formik.errors.to)}
                  helperText={formik.touched.to && formik.errors.to}
                />
              </Grid>

              {/* Specific BAC Status */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specific BAC Status"
                  name="specificBACStatus"
                  value={formik.values.specificBACStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.specificBACStatus && Boolean(formik.errors.specificBACStatus)}
                  helperText={formik.touched.specificBACStatus && formik.errors.specificBACStatus}
                />
              </Grid>

              {/* Message-First 255 characters */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Message- First 255 characters"
                  name="messageFirst255Characters"
                  value={formik.values.messageFirst255Characters}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.messageFirst255Characters && Boolean(formik.errors.messageFirst255Characters)}
                  helperText={formik.touched.messageFirst255Characters && formik.errors.messageFirst255Characters}
                />
              </Grid>

              {/* Remind Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Remind Time"
                  name="remindTime"
                  value={formik.values.remindTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.remindTime && Boolean(formik.errors.remindTime)}
                  helperText={formik.touched.remindTime && formik.errors.remindTime}
                />
              </Grid>

              {/* WhatsApp Label */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WhatsApp Label"
                  name="whatsappLabel"
                  value={formik.values.whatsappLabel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.whatsappLabel && Boolean(formik.errors.whatsappLabel)}
                  helperText={formik.touched.whatsappLabel && formik.errors.whatsappLabel}
                />
              </Grid>

              {/* WhatsApp Messages Owner */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="WhatsApp Messages Owner"
                  name="whatsappMessagesOwner"
                  value={formik.values.whatsappMessagesOwner}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.whatsappMessagesOwner && Boolean(formik.errors.whatsappMessagesOwner)}
                  helperText={formik.touched.whatsappMessagesOwner && formik.errors.whatsappMessagesOwner}
                >
                  <MenuItem value="Marketing Team">Marketing Team</MenuItem>
                  <MenuItem value="Sales Team">Sales Team</MenuItem>
                  <MenuItem value="Support Team">Support Team</MenuItem>
                </TextField>
              </Grid>

              {/* Media Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Media Name"
                  name="mediaName"
                  value={formik.values.mediaName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mediaName && Boolean(formik.errors.mediaName)}
                  helperText={formik.touched.mediaName && formik.errors.mediaName}
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

              {/* Message Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Message Time"
                  name="messageTime"
                  value={formik.values.messageTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.messageTime && Boolean(formik.errors.messageTime)}
                  helperText={formik.touched.messageTime && formik.errors.messageTime}
                />
              </Grid>

              {/* From */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="From"
                  name="from"
                  value={formik.values.from}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.from && Boolean(formik.errors.from)}
                  helperText={formik.touched.from && formik.errors.from}
                />
              </Grid>

              {/* BagAChat MessageId */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="BagAChat MessageId"
                  name="bagAChatMessageId"
                  value={formik.values.bagAChatMessageId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bagAChatMessageId && Boolean(formik.errors.bagAChatMessageId)}
                  helperText={formik.touched.bagAChatMessageId && formik.errors.bagAChatMessageId}
                />
              </Grid>

              {/* BagAChat Linked WA Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="BagAChat Linked WA Number"
                  name="bagAChatLinkedWANumber"
                  value={formik.values.bagAChatLinkedWANumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bagAChatLinkedWANumber && Boolean(formik.errors.bagAChatLinkedWANumber)}
                  helperText={formik.touched.bagAChatLinkedWANumber && formik.errors.bagAChatLinkedWANumber}
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

              {/* WhatsApp Type */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WhatsApp Type"
                  name="whatsappType"
                  value={formik.values.whatsappType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.whatsappType && Boolean(formik.errors.whatsappType)}
                  helperText={formik.touched.whatsappType && formik.errors.whatsappType}
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
                  <TableCell>WhatsApp Messages Image</TableCell>
                  <TableCell>WhatsApp Messages Information</TableCell>
                  <TableCell>WhatsApp Messages Name</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Media Type</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Specific BAC Status</TableCell>
                  <TableCell>Message-First 255 characters</TableCell>
                  <TableCell>Remind Time</TableCell>
                  <TableCell>WhatsApp Label</TableCell>
                  <TableCell>WhatsApp Messages Owner</TableCell>
                  <TableCell>Media Name</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Message Time</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>BagAChat MessageId</TableCell>
                  <TableCell>BagAChat Linked WA Number</TableCell>
                  <TableCell>Owner Email</TableCell>
                  <TableCell>Old Record ID</TableCell>
                  <TableCell>WhatsApp Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((whatsappMessage) => (
                  <TableRow key={whatsappMessage.id}>
                    <TableCell>{whatsappMessage.id}</TableCell>
                    <TableCell>{whatsappMessage.whatsappMessagesImage}</TableCell>
                    <TableCell>{whatsappMessage.whatsappMessagesInformation}</TableCell>
                    <TableCell>{whatsappMessage.whatsappMessagesName}</TableCell>
                    <TableCell>{whatsappMessage.message}</TableCell>
                    <TableCell>{whatsappMessage.mediaType}</TableCell>
                    <TableCell>{whatsappMessage.direction}</TableCell>
                    <TableCell>{whatsappMessage.contact}</TableCell>
                    <TableCell>{whatsappMessage.status}</TableCell>
                    <TableCell>{whatsappMessage.to}</TableCell>
                    <TableCell>{whatsappMessage.specificBACStatus}</TableCell>
                    <TableCell>{whatsappMessage.messageFirst255Characters}</TableCell>
                    <TableCell>{whatsappMessage.remindTime}</TableCell>
                    <TableCell>{whatsappMessage.whatsappLabel}</TableCell>
                    <TableCell>{whatsappMessage.whatsappMessagesOwner}</TableCell>
                    <TableCell>{whatsappMessage.mediaName}</TableCell>
                    <TableCell>{whatsappMessage.lead}</TableCell>
                    <TableCell>{whatsappMessage.messageTime}</TableCell>
                    <TableCell>{whatsappMessage.from}</TableCell>
                    <TableCell>{whatsappMessage.bagAChatMessageId}</TableCell>
                    <TableCell>{whatsappMessage.bagAChatLinkedWANumber}</TableCell>
                    <TableCell>{whatsappMessage.ownerEmail}</TableCell>
                    <TableCell>{whatsappMessage.oldRecordId}</TableCell>
                    <TableCell>{whatsappMessage.whatsappType}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(whatsappMessage.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(whatsappMessage.id)} color="error">
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

export default WhatsAppMessagesForm;
