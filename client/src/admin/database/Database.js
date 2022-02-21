import React from 'react';
import { UserForm, UserTable } from './user';
import { CategoryForm, CategoryTable } from './category';
import { FlowerForm, FlowerTable } from './flower';
import { AddonForm, AddonTable } from './addon';
import { ColorForm, ColorTable } from './color';
import { SizeForm, SizeTable } from './size';
import { ProductForm, ProductTable } from './product';
import { OrderTable } from './order';
import { CouponForm, CouponTable } from './coupon';
import { SubscribeTable, SubscribeForm } from './subscribe';
import { CreateCategoryData } from './category/categoryTable/CreateCategoryData';
import { CreateProductData } from './product/productTable/CreateProductData';
import { CreateUserData } from './user/userTable/CreateUserData';
import { CreateCouponData } from './coupon/couponTable/CreateCouponData';
import { CreatePromotionCodeData } from './promotionCode/promotionCodeTable/CreatePromotionCodeData';
import { CreateOrderData } from './order/orderTable/CreateOrderData';
import { CreateFlowerData } from './flower/flowerTable/CreateFlowerData';
import { CreateAddonData } from './addon/addonTable/CreateAddonData';
import { CreateColorData } from './color/colorTable/CreateColorData';
import { CreateSizeData } from './size/sizeTable/CreateSizeData';
import { CreateSubscribeData } from './subscribe/subscribeTable/CreateSubscribeData';
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import api from '../../api';

function Database(props) {
    const [rows, setRows] = React.useState([]);
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [historyChanged, setHistoryChanged] = React.useState(false);

    let history = useHistory();

    const {
        setLinkDisableObject
    } = props;

    const urlPath = window.location.pathname;
    let fetchUrl = '';
    let chosenFunction = function (params) { };
    if (urlPath === '/admin/user' || urlPath === '/admin/user/add') {
        fetchUrl = 'user/getAllUsers';
        chosenFunction = CreateUserData;
    } else if (urlPath === '/admin/base' || urlPath === '/admin/base/add' || urlPath.includes('/admin/base/edit')) {
        fetchUrl = 'base/getAllBases';
        chosenFunction = CreateCategoryData;
    } else if (urlPath === '/admin/product' || urlPath === '/admin/product/add' || urlPath.includes('/admin/product/edit')) {
        fetchUrl = 'product/getAllProducts';
        chosenFunction = CreateProductData;
    } else if (urlPath === '/admin/coupon' || urlPath === '/admin/coupon/add' || urlPath.includes('/admin/coupon/edit')) {
        fetchUrl = 'coupon/getAllCoupons';
        chosenFunction = CreateCouponData;
    } else if (urlPath === '/admin/promotion-code' || urlPath === '/admin/promotion-code/add') {
        fetchUrl = 'promotionCode/getAllPromotionCodes';
        chosenFunction = CreatePromotionCodeData;
    } else if (urlPath === '/admin/order') {
        fetchUrl = 'order/getAllOrders';
        chosenFunction = CreateOrderData;
    } else if (urlPath === '/admin/flower' || urlPath === '/admin/flower/add' || urlPath.includes('/admin/flower/edit')) {
        fetchUrl = 'flower/getAllFlowers';
        chosenFunction = CreateFlowerData;
    } else if (urlPath === '/admin/addon' || urlPath === '/admin/addon/add' || urlPath.includes('/admin/addon/edit')) {
        fetchUrl = 'addon/getAllAddons';
        chosenFunction = CreateAddonData;
    } else if (urlPath === '/admin/color' || urlPath === '/admin/color/add' || urlPath.includes('/admin/color/edit')) {
        fetchUrl = 'color/getAllColors';
        chosenFunction = CreateColorData;
    } else if (urlPath === '/admin/size' || urlPath === '/admin/size/add' || urlPath.includes('/admin/size/edit')) {
        fetchUrl = 'size/getAllSizes';
        chosenFunction = CreateSizeData;
    } else if (urlPath === '/admin/subscribe' || urlPath === '/admin/subscribe/add') {
        fetchUrl = 'subscribe/getAllSubscribes';
        chosenFunction = CreateSubscribeData;
    }

    history.listen((location, action) => {
        setRows([]);
        setFilteredRows([]);
        setHistoryChanged(!historyChanged);
    })


    React.useEffect(() => {
        if (urlPath === '/admin/user') {
            setLinkDisableObject({
                'dashboard': false,
                'user': true,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/base') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': true,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/product') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': true,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/coupon') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': true,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/promotion-code') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': true,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/order') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': true,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/flower') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': true,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/color') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': true,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/size') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': true,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/addon') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': true,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/base') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': true,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/subscribe') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': true,
                'subscribedUser': false,
            });
        } else if (urlPath === '/admin/subscribed-user') {
            setLinkDisableObject({
                'dashboard': false,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': true,
            });
        } else {
            setLinkDisableObject({
                'dashboard': true,
                'user': false,
                'order': false,
                'product': false,
                'category': false,
                'coupon': false,
                'promotionCode': false,
                'flower': false,
                'color': false,
                'size': false,
                'addon': false,
                'subscribe': false,
                'subscribedUser': false,
            });
        }
        if (fetchUrl !== '') {
            fetch(`${api}/${fetchUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(data => {
                    const rows = data.data.map(obj => {
                        return chosenFunction(obj);
                    });
                    setRows(rows);
                    setFilteredRows(rows);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchUrl, urlPath, historyChanged]);

    return (
        <Switch>
            {/* <Route exact path="/admin/coupon/edit/:id">
                <CouponForm rows={rows} />
            </Route> */}
            <Route path="/admin/product/edit/:id">
                <ProductForm />
            </Route>
            {/* <Route path="/admin/subscribed-user/edit/:id">
                <SubscribedUserForm />
            </Route> */}
            <Route path="/admin/base/edit/:id">
                <CategoryForm rows={rows} />
            </Route>
            <Route path="/admin/flower/edit/:id">
                <FlowerForm rows={rows} />
            </Route>
            <Route path="/admin/size/edit/:id">
                <SizeForm rows={rows} />
            </Route>
            <Route path="/admin/color/edit/:id">
                <ColorForm rows={rows} />
            </Route>
            <Route path="/admin/addon/edit/:id">
                <AddonForm />
            </Route>
            <Route path="/admin/user/add">
                <UserForm rows={rows} />
            </Route>
            {/* <Route exact path="/admin/promotion-code/add">
                <PromotionCodeForm rows={rows} />
            </Route> */}
            <Route exact path="/admin/coupon/add">
                <CouponForm rows={rows} />
            </Route>
            <Route exact path="/admin/subscribe/add">
                <SubscribeForm rows={rows} />
            </Route>
            <Route path="/admin/base/add">
                <CategoryForm rows={rows} />
            </Route>
            <Route path="/admin/product/add">
                <ProductForm />
            </Route>
            <Route path="/admin/flower/add">
                <FlowerForm rows={rows} />
            </Route>
            <Route path="/admin/size/add">
                <SizeForm rows={rows} />
            </Route>
            <Route path="/admin/color/add">
                <ColorForm rows={rows} />
            </Route>
            <Route path="/admin/addon/add">
                <AddonForm />
            </Route>
            {/* <Route path="/admin/promotion-code">
                <PromotionCodeTable
                    rows={rows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="code"
                    searchField="code"
                />
            </Route> */}
            <Route exact path="/admin/coupon">
                <CouponTable
                    rows={rows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/user">
                <UserTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/base">
                <CategoryTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/product">
                <ProductTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/order">
                <OrderTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="orderNumber"
                    searchField="orderNumber"
                />
            </Route>
            <Route path="/admin/flower">
                <FlowerTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/size">
                <SizeTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/color">
                <ColorTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/addon">
                <AddonTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route>
            <Route path="/admin/subscribe">
                <SubscribeTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="packageLengthUnit"
                    searchField="packageLengthUnit"
                />
            </Route>
            {/* <Route path="/admin/subscribed-user">
                <SubscribedUserTable
                    rows={rows}
                    setRows={setRows}
                    filteredRows={filteredRows}
                    setFilteredRows={setFilteredRows}
                    tableOrder="name"
                    searchField="name"
                />
            </Route> */}
        </Switch>
    );
}

export default Database;