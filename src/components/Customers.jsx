import React, { useEffect, useState } from 'react';
import ReactStars from "react-rating-stars-component";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteReview, getAllReviews, updateReview } from '../services/reviewServices';
import { deleteUser, getStaff } from '../services/UsersService';
import { getAllCustomersSelector, loadCustomers } from '../storemini/reducers/customers';

export default function Customers() {
    const [favorite, setFavorite] = useState([]);
    const dispatch = useDispatch();
    const staff = useSelector(getAllCustomersSelector);

    const getStaffHandler = async () => {

    }

    const onDeleteHandler = async (user) => {
        console.log({ user });
        const preUsers = staff;
        const filtered = staff.filter(rev => rev._id !== user._id);
        // setStaff(filtered);
        try {
            await deleteUser(user.name);
        } catch (error) {
            toast.error('Something went wrong User Not Deleted !!!');
            // setStaff(preUsers)
        }
    }

    useEffect(() => {
        dispatch(loadCustomers());
        //    alert( JSON.stringify(staff));
    }, [])
    return (
        <div>
            <div className="container">
                <div className="display-6 px-3 fw-bold mt-3 ">All Customers</div>
            </div>
            <div class="table-responsive">
                <table className="table mx-2 mt-3">
                    <thead>
                        <tr className="bg-info">
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">CreatedAt</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                    {staff && staff.map((user, index) => {
                        console.log(user);
                        return (
                            <tr>
                                <td className="px-2" style={{ width: "5%" }}>{index + 1}</td>
                                <td style={{ width: "25%" }}>{user.name}</td>
                                <td style={{ width: "25%" }} >{user.email}</td>
                                <td style={{ width: "10%" }}>{user.createdAt.substring(0, 10)}</td>
                                <td style={{ width: "10%" }}><div class="d-grid gap-1 mx-auto">
                                    <button class="btn btn-sm btn-info" type="button">Detail</button>
                                    <button onClick={() => onDeleteHandler(user)} class="btn btn-sm btn-danger" type="button">Delate</button>
                                </div></td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
    )
}