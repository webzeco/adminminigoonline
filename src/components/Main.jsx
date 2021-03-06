import React, { useEffect, useState } from 'react';
import Home from './Home';
import NavBar from './common/NavBar';
import SideNavBar from './common/SideNavBar';
import { Route, Switch, useHistory } from "react-router-dom";
import AddProduct from './addProductComponent';
import ShowProducts from './ShowProducts';
import Login from './Login';
import Orders from './Orders';
import { UserContext } from './contexts/UserContext';
import NotFound from './NotFound';
import Staff from './Staff';
import Categories from './Categories';
import { ToastContainer, toast } from 'react-toastify';
import { forgotPassword, login, resetPassword } from '../services/authService';
import { addNewProduct, addNewProductImages, deleteProduct, getAllProducts } from '../services/productServices';
import { getMe } from '../services/UsersService';
import OrderDetail from './OrderDetail';
import { createSubCategory, deleteSubCategory, getAllCategories } from '../services/categoryService';
import { CategoryContext } from './contexts/categoryContext';
import Profile from './Profile';
import Reviews from './Reviews';
import Transaction from './Transactions';
import ResetPassword from './ResetPassword';
import Forgot from './Forgot';
import Baskets from './Baskets';
import UpdatePassword from './UpdatePassword';
import AddUser from './AddUser';
import Customers from './Customers';
import EditProduct from './EditProduct';
export default function Main() {
  const history = useHistory();
  const [user, setUser] = useState();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState();


  useEffect(() => {
    if (!user) {
    }
    return () => {
      console.log('clean up');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      console.log('clean up');
    }
  }, [categories]);

  useEffect(() => {
    getAllProductHandler();
    getMeHandler();
    getAllCategoriesHandler();
    return () => {
      console.log('clean up');
    }
  }, []);

  const loginHandler = async (user) => {
    try {
      const { data } = await login(user)
      localStorage.setItem("jwt", data.token);
      toast.success("logged in successfully !!!", {
        position: toast.POSITION.TOP_CENTER
      });
      // history.push('/');
      window.location = '/';
    } catch (error) {
      toast.error("Incorrect username or password", {
        position: toast.POSITION.TOP_CENTER,
      });

    }
  }
  const forgotHandler = async (email) => {
    const data = await forgotPassword(email)
    if (data.data.status === 'success')
      toast.success("Email successfully sent Please check your mail");
    else {
      toast.error(data.data.message);
      history.push("/");
    }
  };

  const getMeHandler = async () => {
    const { data } = await getMe();
    // console.log({ data });
    setUser(data);
  }
  const getAllCategoriesHandler = async () => {
    const { data } = await getAllCategories();
    // console.log(data.data);
    setCategories(data.data);
  }
  const getAllProductHandler = async () => {
    try {
      const { data } = await getAllProducts();
      setProducts(data.data);
    } catch (error) {
      toast.error("something went wrong to get all products", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(products);
  }
  const addProductHandler = async (product, images) => {
    console.log(product);
    const newProduct = await addNewProduct(product);
    console.log(newProduct);
    await addNewProductImages(newProduct.data.product._id, images);
    toast.success("Product added successfully !!!", {
      position: toast.POSITION.TOP_CENTER
    });
    // history.push('/');
    // window.location = '/';
  }
  const createSubCategoryHandler = async (data) => {
    const allCates = [...categories];
    const targetIndex = allCates.findIndex(cate => cate.category === data.parent);
    allCates[targetIndex].subCategories.push(data);
    //  for (let i = 0; i < allCates[targetIndex].subCategories.length; i++) {
    //    const sub = allCates[targetIndex].subCategories[i];
    //    if(sub.name===data.name){

    //     return alert('already existed')
    //      }
    //  }
    // console.log({requiredSubCates});
    // allCates[targetIndex].subCategories = requiredSubCates;
    console.log({ categories });
    console.log({ allCates });
    setCategories(allCates);
    createSubCategory(data);
    // getAllCategoriesHandler();
  }
  const deleteSubCategoryHandler = async (data) => {
    const allCates = [...categories];
    const targetIndex = allCates.findIndex(cate => cate.category === data.category);
    const requiredSubCates = allCates[targetIndex].subCategories.filter(sub => sub.name !== data.subCategory);
    console.log({ requiredSubCates });
    allCates[targetIndex].subCategories = requiredSubCates;
    console.log({ cate: categories[targetIndex].subCategories });
    console.log({ all: allCates[targetIndex].subCategories });
    setCategories(allCates);
    deleteSubCategory(data);
    // getAllCategoriesHandler();
  }


  const deleteProductHandler = async (id) => {
    try {
      const { data } = await deleteProduct(id);
      const remainProd = [...products];
      setProducts(remainProd.filter(pro => pro._id !== id));
      toast.success("Product successfully deleted", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error("something went wrong to get all products", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log({ products });
  }

  const resetPasswordHandler = async (values) => {
    const { password, confirmPassword, token } = values;
    console.log(values);
    try {
      await resetPassword({ password, confirmPassword }, token);
      toast.success(" Password Reset Successfully !!", {
        position: toast.POSITION.TOP_CENTER,
      });
      setTimeout(() => {
        toast.success(" Login with New Password !!", {
          position: toast.POSITION.TOP_CENTER,
        });
        history.push("/login");
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error("Invalid token !!!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <UserContext.Provider value={{ user, loginHandler }}>
      <CategoryContext.Provider value={{ categories, deleteSubCategoryHandler, createSubCategoryHandler }}>
        <div class="wrapper">
          <ToastContainer style={{ width: "322px" }} />
          {/* {user &&  <SideNavBar /> } */}
          <SideNavBar />
          <div class="main">
            {/* {user &&  <NavBar /> } */}
            <NavBar />
            <Switch>
              {/* <Route exact path="/" component={Home} /> */}
              <Route
                exact
                path="/"
                render={(props) => user ? <Home /> : <Login onLogin={loginHandler} />
                }
              />
              <Route
                exact
                path="/addProduct"
                render={(props) => <AddProduct addProduct={addProductHandler} />}
              />
              <Route
                exact
                path="/basket"
                render={(props) => <Baskets />}
              />
              <Route
                exact
                path="/showProduct"
                render={(props) => <ShowProducts
                  deleteProduct={deleteProductHandler}
                  products={products}
                  {...props}
                />}
              />

              <Route
                exact
                path="/reviews"
                render={(props) => <Reviews />}
              />
              <Route
                exact
                path="/editProduct"
                render={(props) => <EditProduct {...props} />}
              />
              <Route
                exact
                path="/login"
                render={(props) => <Login onLogin={loginHandler} />}
              />
              <Route
                exact
                path="/resetPassword/:token"
                render={(props) => (
                  <ResetPassword onResetPassword={resetPasswordHandler} {...props} />
                )}
              />
              <Route
                exact
                path="/forgot"
                render={(props) => (
                  <Forgot onForgot={forgotHandler} {...props} />
                )}
              />
              <Route
                exact
                path="/updatePassword"
                render={(props) => (
                  <UpdatePassword  {...props} />
                )}
              />
              <Route
                exact
                path="/customers"
                render={(props) => (
                  <Customers  {...props} />
                )}
              /> <Route
                exact
                path="/addUser"
                render={(props) => (
                  <AddUser  {...props} />
                )}
              />
              <Route
                exact
                path="/orders"
                render={(props) => <Orders {...props} />}
              />
              <Route
                exact
                path="/transactions"
                render={(props) => <Transaction />}
              />
              <Route
                exact
                path="/orderDetail"
                render={(props) => <OrderDetail />}
              />
              <Route
                exact
                path="/staff"
                render={(props) => <Staff />}
              />
              <Route
                exact
                path="/categories"
                render={(props) => <Categories />}
              />
              <Route
                exact
                path="/profile"
                render={(props) => <Profile />}
              />
              <Route
                exact
                path="*"
                render={(props) => <NotFound />}
              />
            </Switch>
          </div>

        </div>
      </CategoryContext.Provider>
    </UserContext.Provider>

  )
}
