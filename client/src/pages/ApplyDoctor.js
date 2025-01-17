import React from 'react';
import Layout from './../components/Layout';
import { Col, Form, Row, Input, TimePicker, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment'

const ApplyDoctor = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/apply-doctor', { ...values, userId: user._id , 
                timings:[
        moment(values.timings[0]).format("HH:mm"),
        moment(values.timings[1]).format("HH:mm"),
      ]},{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    };

    return (
        <Layout>
            <h1 className="text-center">Apply Doctor</h1>
            <Form layout="vertical" onFinish={handleFinish} className="m-3">
                <h4>Personal Details :</h4>
                <Row gutter={16}>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your first name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your last name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Phone No" name="phone" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your phone number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your email" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Website" name="website">
                            <Input type="text" placeholder="Your website" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your address" />
                        </Form.Item>
                    </Col>
                </Row>
                <h4>Professional Details :</h4>
                <Row gutter={16}>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your specialization" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
                            <Input type="text" placeholder="Your experience" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Fees Per Consultation" name="feesPerConsultation" rules={[{ required: true }]}>
                            <Input type="number" placeholder="Your fee per consultation" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
                            <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={8}></Col>
                    <Col xs={24} md={12} lg={8}>
                        <button className='btn btn-primary form-btn' type="submit">Submit</button>
                    </Col>
                </Row>
            </Form>
        </Layout>
    );
};

export default ApplyDoctor;
