import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DatePicker, TimePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';

const BookingPage = () => {
    const { user } = useSelector(state => state.user)
    const params = useParams();
    const [doctor, setDoctor] = useState(null); // Changed to singular for a single doctor object
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false)
    const dispatch = useDispatch()
    const getUserData = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/getDoctorById",
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token'),
                    },
                }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    //BBOKING FUNCTION
    const handleBooking = async () => {
        try {
            setIsAvailable(true);
            if(!date && !time){
                return alert("Date & Time Required");
            }
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/book-appointment',
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctor,
                    date:  date,
                    userInfo: user,
                    time:  time
                }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            }
            )
            dispatch(hideLoading())
            if (res.data.success) {
                message.success(res.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    }
    const handleAvailability = async () => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/booking-availbility',
            {doctorId:params.doctorId, date, time},
            {
                headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
        }
            }
        )
        dispatch(hideLoading())
        if (res.data.success) {
            setIsAvailable(true)
            console.log(isAvailable)
            message.success(res.data.message);
          } else {
            message.error(res.data.message);
          }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    }

    useEffect(() => {
        getUserData();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <h3>Booking Page</h3>
            <div className="container m-2">
                {doctor && (
                    <div>
                        <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
                        <h4>Fees: {doctor.feesPerConsultation}</h4>
                        <h4>
                        Timings: {doctor.timings && doctor.timings[0]} - {doctor.timings && doctor.timings[1]}
            </h4>
                        <div className="d-flex flex-column w-50">
                            <DatePicker
                                aria-required={"true"}
                                className="m-2"
                                format="DD-MM-YYYY"
                                onChange={(value) => setDate(value)}
                            />
                            <TimePicker
                                aria-required={"true"}
                                format="HH:mm"
                                className="m-2"
                                onChange={(value) => setTime(value)}
                            />
                            <button className="btn btn-primary m-2" onClick={handleAvailability}>Check Availability</button>
                        
                            <button className="btn btn-dark m-2" onClick={handleBooking}>Book Now</button>
                           
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;


