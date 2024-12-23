import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import defaultImages from 'assets/images/users/default.png';
import { PatternFormat } from 'react-number-format';
import { Camera } from 'iconsax-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Swal from 'sweetalert2';
// Validation schema for all form fields using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  role: Yup.string().required('Role is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  profile: Yup.string().required('Profile is required'),
  addedBy: Yup.string().required('Added By is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number is not valid')
    .required('Phone is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number is not valid')
    .required('Mobile is required'),
  website: Yup.string().url('Invalid URL format').required('Website is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  alias: Yup.string(),
  fax: Yup.string(),
  addressLine1: Yup.string().required('Address Line 1 is required'),
  addressLine2: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  postalCode: Yup.string()
    .matches(/^[0-9]{5,6}$/, 'Postal code is not valid')
    .required('Postal Code is required'),
  language: Yup.string().required('Language is required'),
  countryLocale: Yup.string().required('Country Locale is required'),
  dateFormat: Yup.string().required('Date Format is required'),
  timeFormat: Yup.string().required('Time Format is required'),
  timeZone: Yup.string().required('Time Zone is required'),
  numberFormat: Yup.string().required('Number Format is required')
});

export default function PersonalInformationForm() {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(defaultImages);

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  // Formik initial values
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      profile: '',
      addedBy: '',
      phone: '',
      mobile: '',
      website: '',
      dateOfBirth: '',
      alias: '',
      fax: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      language: '',
      countryLocale: '',
      dateFormat: '',
      timeFormat: '',
      timeZone: '',
      numberFormat: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Save data to localStorage on form submit
      localStorage.setItem('personalInfo', JSON.stringify(values));
      Swal.fire('Profile Updated', 'Your profile has been updated successfully!', 'success');
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MainCard title="Personal Information">
            <Grid container spacing={3}>
              {/* Avatar Upload */}
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                  <FormLabel
                    htmlFor="change-avatar"
                    sx={{
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      '&:hover .MuiBox-root': { opacity: 1 },
                      cursor: 'pointer'
                    }}
                  >
                    <Avatar alt="Avatar" src={avatar} sx={{ width: 76, height: 76 }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Stack spacing={0.5} alignItems="center">
                        <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                        <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                          Upload
                        </Typography>
                      </Stack>
                    </Box>
                  </FormLabel>
                  <TextField
                    type="file"
                    id="change-avatar"
                    variant="outlined"
                    sx={{ display: 'none' }}
                    onChange={(e: any) => setSelectedImage(e.target.files?.[0])}
                  />
                </Stack>
              </Grid>

              {/* Personal Details */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstName">First Name</InputLabel>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastName">Last Name</InputLabel>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="profile">Profile</InputLabel>
                  <TextField
                    fullWidth
                    id="profile"
                    name="profile"
                    value={formik.values.profile}
                    onChange={formik.handleChange}
                    error={formik.touched.profile && Boolean(formik.errors.profile)}
                    helperText={formik.touched.profile && formik.errors.profile}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Select
                  fullWidth
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Creditor">Creditor</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="addedBy">Added By</InputLabel>
                <Select
                  fullWidth
                  id="addedBy"
                  name="addedBy"
                  value={formik.values.addedBy}
                  onChange={formik.handleChange}
                  error={formik.touched.addedBy && Boolean(formik.errors.addedBy)}
                >
                  <MenuItem value="Santosh">Santosh</MenuItem>
                  <MenuItem value="Ramesh">Ramesh</MenuItem>
                  <MenuItem value="Bhavesh">Bhavesh</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <PatternFormat
                    format="#### ######"
                    fullWidth
                    customInput={TextField}
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="mobile">Mobile</InputLabel>
                  <PatternFormat
                    format="#### ######"
                    fullWidth
                    customInput={TextField}
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="website">Website</InputLabel>
                  <TextField
                    fullWidth
                    type="url"
                    id="website"
                    name="website"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    error={formik.touched.website && Boolean(formik.errors.website)}
                    helperText={formik.touched.website && formik.errors.website}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="dateOfBirth">Date of Birth</InputLabel>
                  <TextField
                    fullWidth
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="alias">Alias</InputLabel>
                  <TextField fullWidth id="alias" name="alias" value={formik.values.alias} onChange={formik.handleChange} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="fax">Fax</InputLabel>
                  <TextField fullWidth id="fax" name="fax" value={formik.values.fax} onChange={formik.handleChange} />
                </Stack>
              </Grid>

              {/* Submit Button */}
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid item xs={12}>
            {' '}
            <MainCard title="Address Details">
              <Grid container spacing={3}>
                {/* Address Details */}
                <Grid item xs={12}>
                  <Typography variant="h6">Address Details</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="addressLine1">Address Line 1</InputLabel>
                    <TextField
                      fullWidth
                      id="addressLine1"
                      name="addressLine1"
                      value={formik.values.addressLine1}
                      onChange={formik.handleChange}
                      error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                      helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="addressLine2">Address Line 2</InputLabel>
                    <TextField
                      fullWidth
                      id="addressLine2"
                      name="addressLine2"
                      value={formik.values.addressLine2}
                      onChange={formik.handleChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="city">City</InputLabel>
                    <TextField
                      fullWidth
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="state">State</InputLabel>
                    <TextField
                      fullWidth
                      id="state"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      error={formik.touched.state && Boolean(formik.errors.state)}
                      helperText={formik.touched.state && formik.errors.state}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="country">Country</InputLabel>
                    <TextField
                      fullWidth
                      id="country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      error={formik.touched.country && Boolean(formik.errors.country)}
                      helperText={formik.touched.country && formik.errors.country}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="postalCode">Postal Code</InputLabel>
                    <TextField
                      fullWidth
                      id="postalCode"
                      name="postalCode"
                      value={formik.values.postalCode}
                      onChange={formik.handleChange}
                      error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                      helperText={formik.touched.postalCode && formik.errors.postalCode}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
              <MainCard title="Locale Information">
                <Grid container spacing={3}>
                  {/* Language */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="language">Language</InputLabel>
                      <Select id="language" name="language" value={formik.values.language} onChange={formik.handleChange} fullWidth>
                        <MenuItem value="en-US">English (United States)</MenuItem>
                        <MenuItem value="en-UK">English (United Kingdom)</MenuItem>
                        <MenuItem value="hi-IN">Hindi (India)</MenuItem>
                        {/* Add more languages as needed */}
                      </Select>
                      {formik.touched.language && formik.errors.language && (
                        <Typography variant="caption" color="error">
                          {formik.errors.language}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Country Locale */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="countryLocale">Country Locale</InputLabel>
                      <Select
                        id="countryLocale"
                        name="countryLocale"
                        value={formik.values.countryLocale}
                        onChange={formik.handleChange}
                        fullWidth
                      >
                        <MenuItem value="IN">India</MenuItem>
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="UK">United Kingdom</MenuItem>
                        {/* Add more country locales as needed */}
                      </Select>
                      {formik.touched.countryLocale && formik.errors.countryLocale && (
                        <Typography variant="caption" color="error">
                          {formik.errors.countryLocale}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Date Format */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="dateFormat">Date Format</InputLabel>
                      <Select id="dateFormat" name="dateFormat" value={formik.values.dateFormat} onChange={formik.handleChange} fullWidth>
                        <MenuItem value="MMM D, YYYY">MMM D, YYYY</MenuItem>
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="MM-DD-YYYY">MM-DD-YYYY</MenuItem>
                        {/* Add more date formats as needed */}
                      </Select>
                      {formik.touched.dateFormat && formik.errors.dateFormat && (
                        <Typography variant="caption" color="error">
                          {formik.errors.dateFormat}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Time Format */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="timeFormat">Time Format</InputLabel>
                      <RadioGroup
                        aria-label="timeFormat"
                        name="timeFormat"
                        value={formik.values.timeFormat}
                        onChange={formik.handleChange}
                        row
                      >
                        <FormControlLabel value="12 Hours" control={<Radio />} label="12 Hours" />
                        <FormControlLabel value="24 Hours" control={<Radio />} label="24 Hours" />
                      </RadioGroup>
                      {formik.touched.timeFormat && formik.errors.timeFormat && (
                        <Typography variant="caption" color="error">
                          {formik.errors.timeFormat}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Time Zone */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="timeZone">Time Zone</InputLabel>
                      <Autocomplete
                        id="timeZone"
                        options={[
                          { label: '(GMT 0:00) Greenwich Mean Time', value: 'GMT' },
                          { label: '(GMT +5:30) India Standard Time', value: 'Asia/Kolkata' },
                          { label: '(GMT +8:00) China Standard Time', value: 'Asia/Shanghai' },
                          { label: '(GMT -5:00) Eastern Standard Time', value: 'America/New_York' }
                          // Add more time zones as needed
                        ]}
                        getOptionLabel={(option :any) => option.label}
                        onChange={(event, value :any) => formik.setFieldValue('timeZone', value?.value)}
                        renderInput={(params) => <TextField {...params} label="Select Time Zone" variant="outlined" />}
                        value={formik.values.timeZone}
                      />
                      {formik.touched.timeZone && formik.errors.timeZone && (
                        <Typography variant="caption" color="error">
                          {formik.errors.timeZone}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  {/* Number Format */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="numberFormat">Number Format</InputLabel>
                      <Select
                        id="numberFormat"
                        name="numberFormat"
                        value={formik.values.numberFormat}
                        onChange={formik.handleChange}
                        fullWidth
                      >
                        <MenuItem value="1,23,456.789">1,23,456.789</MenuItem>
                        <MenuItem value="1,234,567.89">1,234,567.89</MenuItem>
                        <MenuItem value="1234567.89">1234567.89</MenuItem>
                        {/* Add more number formats as needed */}
                      </Select>
                      {formik.touched.numberFormat && formik.errors.numberFormat && (
                        <Typography variant="caption" color="error">
                          {formik.errors.numberFormat}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Update Profile
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
