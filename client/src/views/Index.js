// import logo from './logo.svg';
import './../assets/css/our-style.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Input,
  FormGroup, Label,
  Popover, PopoverBody
} from 'reactstrap';
import {
  Container,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import Auth from "./../utils/auth";
import {FaQuestionCircle } from 'react-icons/fa';

function Index() {

  // const location = useLocation();

  const navigate = useNavigate();
  const [isLogged] = useState(Auth.loggedIn());

  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    description: '',
    companyName: '',
    email: '',
    phonenumber: '',
    promoCode: '',
    subtotalCost: 0,
    tax: 0,
    grandTotal: 0,
    services: [],
    products: [],
    // serviceLevel: '', // New field for service level
  });
  const [popoverOpen, setPopoverOpen] = useState({
    name: false,
    email: false,
    phonenumber: false,
    description: false,
    companyName: false,
    howDidYouHearAboutUs: false,
    address: false,
    city: false,
    province: false,
    postalcode: false,
    services: false,
    products: false
  });



  const togglePopover = (field) => {
    setPopoverOpen((prevState) => {
      // Reset all fields to false
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // Toggle the selected field
      return { ...newState, [field]: !prevState[field] };
    });
  };

  const handleChange = (event) => {

    const { name, value } = event.target;
    // reset validation if promo code is changed
    // if (name === 'promoCode') {
    //     setValidPromoCode(false);
    // }
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);


    // const promoCodeIsValid = await handlePromoCodeValidation(e);
    // if (!validPromoCode) {
    // }

    if (formData.promoCode === '') {
      if (!formData.name || !formData.email || !formData.phonenumber || !formData.description || !formData.companyName || (!formData.services.length && !formData.products.length) || !formData.subtotalCost || !formData.tax || !formData.grandTotal || !formData.address || !formData.city || !formData.province || !formData.postalcode) {
        // if (!formData.name || !formData.email || !formData.phonenumber || !formData.description || !formData.companyName || (!formData.services.length && !formData.products.length) || !formData.howDidYouHearAboutUs || !formData.subtotalCost || !formData.tax || !formData.grandTotal || !formData.address || !formData.city || !formData.province || !formData.postalcode) {
        alert('Please fill out all required fields');
        return;
      }

      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Quote submitted successfully!');
          // disable for testing
          setFormData({
            name: '',
            userId: '',
            description: '',
            companyName: '',
            email: '',
            phonenumber: '',
            howDidYouHearAboutUs: '',
            subtotalCost: 0,
            tax: 0,
            grandTotal: 0,
            services: [],
            products: [],
            // serviceLevel: '' // Reset service level
          });


          // if (window.confirm('Would you like to download the quote as a PDF?')) {
          //     const element = document.getElementById('quote-form');
          //     const opt = {
          //         margin: 0.5,
          //         filename: 'quote.pdf',
          //         image: { type: 'jpeg', quality: 0.98 },
          //         html2canvas: { scale: 2 },
          //         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          //     };
          //     html2pdf().set(opt).from(element).save();
          // }

          const quoteResponse = await response.json();
          // if (sendEmail) {
          const emailResponse = await fetch('/api/email/quote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({ email: formData.email, quote: quoteResponse })
          });

          if (emailResponse.ok) {
            alert('Email confirmation sent successfully!');
            console.log('Email sent successfully!');
          } else {
            alert('Error sending email');
          }
          // }
          // merged the two fetch requests into one
          const emailNotification = await fetch('/api/email/quote-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({ email: formData.email, quote: quoteResponse })
          });
          if (emailNotification.ok) {
            // alert('Email notification sent successfully!');
            console.log('Email notification sent successfully!');
          }
          else {
            alert('Error sending email notification');
          }
          navigate('/index');
        }
      } catch (error) {
        console.error('Error submitting quote:', error);
      }
    }
    else {
      alert('Invalid promo code');
    }


  };



  return (
    <div className="content light-bg-color pb-0 mb-0">
      <div className="content">
        <Container>
          <h2 className="text-center pt-3 primary-color text-bold">Request a Quote</h2>
          <p className="text-bold pb-2">
            {isLogged ? (
              <span>Logged in as {Auth.getProfile().data.firstName} {Auth.getProfile().data.lastName}. Feel free to adjust the pre-filled data if needed!</span>
            ) : (
              <span>Please fill out the form below to request a quote. <br />
                If you have an account with us already, please log-in to pre-fill your information for a smoother experience</span>
            )}
          </p>

          {/* <p>If you have an account with us already, please log-in to pre-fill your information for a speedy request</p> */}
          <Form onSubmit={handleSubmit} id="quote-form">
            <Row className='g-2'>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id=" floatingFullName"
                    placeholder="Full Name"
                    className='text-cleanar-color text-bold'
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingFullName" className='text-bold'>Full Name</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip1" type="button" tabIndex='-1'
                  // color="link"                                    
                  onClick={() => togglePopover('name')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.name} target="Tooltip1" toggle={() => togglePopover('name')}>
                  <PopoverBody>Enter your full name.</PopoverBody>
                </Popover>
              </Col>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingEmail"
                    placeholder="Email"
                    className='text-cleanar-color text-bold'
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingEmail" className='text-bold'>Email</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip2" type="button" tabIndex='-1'
                  // color="link"
                  onClick={() => togglePopover('email')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.email} target="Tooltip2" toggle={() => togglePopover('email')}>
                  <PopoverBody>Enter your email address.</PopoverBody>
                </Popover>
              </Col>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingPhoneNumber"
                    placeholder="Phone Number"
                    className='text-cleanar-color text-bold'
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingPhoneNumber" className='text-bold'>Phone Number</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip3" type="button" tabIndex='-1' onClick={() => togglePopover('phonenumber')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.phonenumber} target="Tooltip3" toggle={() => togglePopover('phonenumber')}>
                  <PopoverBody>Enter your phone number.</PopoverBody>
                </Popover>
              </Col>
            </Row>
            <Row className='g-2'>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingAddress"
                    placeholder="Address"
                    className='text-cleanar-color text-bold'
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingAddress" className='text-bold'>Address</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip4" type="button" tabIndex='-1' onClick={() => togglePopover('address')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.address} target="Tooltip4" toggle={() => togglePopover('address')}>
                  <PopoverBody>Enter your address.</PopoverBody>
                </Popover>
              </Col>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingCity"
                    placeholder="City"
                    className='text-cleanar-color text-bold'
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingCity" className='text-bold'>City</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip5" type="button" tabIndex='-1' onClick={() => togglePopover('city')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.city} target="Tooltip5" toggle={() => togglePopover('city')}>
                  <PopoverBody>Enter your city.</PopoverBody>
                </Popover>
              </Col>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingProvince"
                    placeholder="Province"
                    className='text-cleanar-color text-bold'
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingState" className='text-bold'>Province</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip6" type="button" tabIndex='-1' onClick={() => togglePopover('province')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.province} target="Tooltip6" toggle={() => togglePopover('province')}>
                  <PopoverBody>Enter your province.</PopoverBody>
                </Popover>
              </Col>
            </Row>
            <Row className='g-2'>
              <Col md='3' xs='10' >
                <Form.Floating className="mb-3 ">
                  <Form.Control
                    type="text"
                    id="floatingPostalCode"
                    placeholder="Postal Code"
                    className='text-cleanar-color text-bold'
                    name="postalcode"
                    value={formData.postalcode}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingPostalCode" className='text-bold'>Postal Code</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip7" type="button" tabIndex='-1' onClick={() => togglePopover('postalcode')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.postalcode} target="Tooltip7" toggle={() => togglePopover('postalcode')}>
                  <PopoverBody>Enter your postal code.</PopoverBody>
                </Popover>
              </Col>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="floatingCompanyName"
                    placeholder="Company Name"
                    className='text-cleanar-color text-bold'
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingCompanyName" className='text-bold '>Company Name</label>
                </Form.Floating>
              </Col>
              <Col md='1' xs='1'>
                <Button id="Tooltip8" type="button" tabIndex='-1' onClick={() => togglePopover('companyName')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.companyName} target="Tooltip8" toggle={() => togglePopover('companyName')}>
                  <PopoverBody>Enter your company name.</PopoverBody>
                </Popover>
              </Col>
              <Col md='3' xs='10'>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    id="promoCode"
                    placeholder="Promo Code"
                    className='text-cleanar-color text-bold'
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleChange}
                  />
                  <label htmlFor="promoCode" className='text-bold'>Promo Code</label>
                </Form.Floating>
              </Col>
              {/* add a button to validate the promo code */}
              {/* <Col md='1' xs='1'>
                                    <Button id="validatePromoCode" type="button" onClick={handlePromoCodeValidation} className='primary-bg-color btn-round btn-icon'><FaCheck /></Button>
                                </Col> */}
              <Col md='1' xs='1'>
                <Button id="Tooltip10" type="button" tabIndex='-1' onClick={() => togglePopover('promoCode')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                <Popover placement="right" isOpen={popoverOpen.promoCode} target="Tooltip10" toggle={() => togglePopover('promoCode')}>
                  <PopoverBody>Enter your promo code. Discount will be reflected on the quote if eligible. Promos cannot be combined.</PopoverBody>
                </Popover>
              </Col>

              {/* <Col md='3' xs='10' className=''>
                                    <FloatingLabel controlId="floatingHowDidYouHear" label="How Did You Hear About Us..." className='text-bold'>
                                        <Form.Select aria-label="How Did You Hear About Us" value={formData.howDidYouHearAboutUs}
                                            name='howDidYouHearAboutUs' onChange={handleChange} className='transparent no-border text-cleanar-color text-bold'>
                                            <option value="">How Did You Hear About Us?...</option>
                                            <option value="Google">Google</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col md='1' xs='1'>
                                    <Button id="Tooltip9" type="button" tabIndex='-1' onClick={() => togglePopover('howDidYouHearAboutUs')} className='primary-bg-color btn-round btn-icon'><FaQuestionCircle /></Button>
                                    <Popover placement="right" isOpen={popoverOpen.howDidYouHearAboutUs} target="Tooltip9" toggle={() => togglePopover('howDidYouHearAboutUs')}>
                                        <PopoverBody>How did you hear about us?</PopoverBody>
                                    </Popover>
                                </Col> */}

            </Row>
            <FormGroup>
              <Label className='text-bold'>Description</Label>
              <Input
                type="textarea"
                name="description"
                placeholder='Please describe the services you are looking for, including any specific requirements or details.'
                value={formData.description}
                onChange={handleChange}
                className='text-cleanar-color text-bold'
              />

            </FormGroup>


            <Row>
              <Col>
                <p className='primary-color text-bold pt-2'>
                  A confirmation email will be sent to you upon submission. Our team will review your request and get back to you as soon as possible. Thank you for choosing CleanAR Solutions!
                </p>
                {/* <FormGroup check className=''>
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                checked={sendEmail}
                                                onChange={() => setSendEmail(!sendEmail)}
                                            />
                                            <span className="form-check-sign"></span>
                                            {/* Check if you would like to receive a copy of the quote by email 
                                            An email confirmation will be sent to you upon submission
                                        </Label>
                                    </FormGroup> */}

              </Col>
            </Row>
            <Row className='pb-3'>
              <Col md className="">
                <Button type="submit" className='secondary-bg-color'>Submit Quote</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default Index;
