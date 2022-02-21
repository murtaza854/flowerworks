import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableToolbar } from "../tableToolbar/TableToolbar";
import { TableHeadCustom } from '../tableHead/TableHeadCustom';
import { stableSort } from '../../stabalizedSort';
import { getComparator } from '../../comparator';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Col, Row } from 'react-bootstrap';
import { Checkbox, TableHead } from '@mui/material';


export default function OrderTable(props) {

    const {
        rows,
        filteredRows,
        setFilteredRows,
        tableOrder,
        searchField,
        setRows,
    } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(tableOrder);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchText, setSearchText] = React.useState('');
    const [open, setOpen] = React.useState([].fill(false, 0, rows.length));

    React.useEffect(() => {
        if (rows.length > 0) {
            setFilteredRows(rows.filter(row => {
                return row[searchField].toLowerCase().includes(searchText.toLowerCase());
            }));
        }
    }, [searchText, rows, setFilteredRows, searchField]);

    const handleSearch = event => {
        setSearchText(event.target.value);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredRows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableToolbar setRows={setRows} rows={rows} selected={selected} handleSearch={handleSearch} searchText={searchText} numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <TableHeadCustom
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredRows.length}
                        />
                        {/* <TableBody> */}
                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   filteredRows.slice().sort(getComparator(order, orderBy)) */}
                        {filteredRows.length > 0 && stableSort(filteredRows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                let coupon = null;
                                if (row.coupon) {
                                    coupon = row.coupon;
                                }
                                let addonCouponSlugs = [];
                                let productCouponSlugs = [];
                                if (coupon && coupon.addons.length > 0) addonCouponSlugs = coupon.addons.map((add) => add.slug);
                                if (coupon && coupon.products.length > 0) productCouponSlugs = coupon.products.map((prod) => prod.slug);
                                const prices = [];
                                let content = [];
                                for (const key in row.items) {
                                    const element = row.items[key];
                                    const quantity = element.quantity;
                                    let totalPrice = 0;
                                    let unitPrice = 0;
                                    let discountedPrice = null;
                                    let discountClass = '';
                                    if (element.type === 'product') {
                                        unitPrice = element.size.price;
                                        totalPrice = element.size.price * quantity;
                                        if (coupon) {
                                            let flag = true;
                                            if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                                            if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                                            if (flag) {
                                                if (coupon.appliedToProducts && productCouponSlugs.includes(element.productSlug)) {
                                                    discountClass = 'line-through';
                                                    if (coupon.type === 'Fixed Amount Discount') {
                                                        discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                                                    } else {
                                                        discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                                                    }
                                                }
                                            }
                                        }
                                    } else if (element.type === 'addon') {
                                        unitPrice = element.price;
                                        totalPrice = element.price * quantity;
                                        if (coupon) {
                                            let flag = true;
                                            if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                                            if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                                            if (flag) {
                                                if (coupon.appliedToAddons && addonCouponSlugs.includes(element.addonSlug)) {
                                                    discountClass = 'line-through';
                                                    if (coupon.type === 'Fixed Amount Discount') {
                                                        discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                                                    } else {
                                                        discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                                                    }
                                                }
                                            }
                                        }
                                    } else if (element.type === 'diy') {
                                        const totalFlowersPrice = element.flowers.reduce((acc, curr) => acc + curr.price, 0);
                                        const totalAddonsPrice = element.addons.reduce((acc, curr) => acc + curr.price, 0);
                                        unitPrice = element.size.price + element.base.price + element.color.price + totalFlowersPrice + totalAddonsPrice;
                                        totalPrice = (element.size.price + element.base.price + element.color.price + totalFlowersPrice + totalAddonsPrice) * quantity;
                                        if (coupon) {
                                            let flag = true;
                                            if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                                            if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                                            if (flag) {
                                                if (coupon.appliedToDIY) {
                                                    discountClass = 'line-through';
                                                    if (coupon.type === 'Fixed Amount Discount') {
                                                        discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                                                        discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (discountedPrice !== null) prices.push(discountedPrice);
                                    else prices.push(totalPrice);
                                    content.push({
                                        key: key,
                                        name: element.name,
                                        image: element.image,
                                        quantity: element.quantity,
                                        totalPrice,
                                        type: element.type,
                                        unitPrice,
                                        discountedPrice,
                                        discountClass,
                                    });
                                }
                                let billDiscountedPrice = null;
                                let finalPrice = prices.reduce((acc, curr) => acc + curr, 0);
                                if (coupon && !coupon.appliedToProducts && !coupon.appliedToAddons && !coupon.appliedToDIY) {
                                    if (coupon.type === 'Fixed Amount Discount') {
                                        if (coupon.minAmount <= finalPrice) {
                                            billDiscountedPrice = (finalPrice - coupon.amountOff) < 0 ? 0 : finalPrice - coupon.amountOff;
                                        }
                                    } else {
                                        if (coupon.minAmount <= finalPrice) {
                                            billDiscountedPrice = (finalPrice - (finalPrice * (coupon.percentOff / 100))).toFixed(2);
                                        }
                                    }
                                }

                                return (
                                    <TableBody key={row.id}>
                                        <TableRow
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => handleClick(event, row.id)}
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    onChange={_ => { }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            // padding="none"
                                            >
                                                {row.orderNumber}
                                            </TableCell>
                                            <TableCell>{row.deliveryDate}</TableCell>
                                            <TableCell>{row.orderDate}</TableCell>
                                            <TableCell>{row.orderStatusDisplay}</TableCell>
                                            <TableCell>{row.coupon ? row.coupon.name : 'No coupon'}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        const openArray = [...open];
                                                        openArray[index] = !openArray[index];
                                                        setOpen(openArray);
                                                    }}
                                                >
                                                    {open[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        <Typography variant="h5" gutterBottom component="div">
                                                            Order Details
                                                        </Typography>
                                                        <Row>
                                                            <Table size="small" aria-label="purchases">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Name</TableCell>
                                                                        <TableCell>Type</TableCell>
                                                                        <TableCell align="right">Unit Price</TableCell>
                                                                        <TableCell align="right">Quantity</TableCell>
                                                                        <TableCell align="right">Total price</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {content.map((row) => (
                                                                        <TableRow key={row.key}>
                                                                            <TableCell component="th" scope="row">
                                                                                {row.name}
                                                                            </TableCell>
                                                                            <TableCell style={{ textTransform: 'capitalize' }}>{row.type}</TableCell>
                                                                            <TableCell align="right">{row.discountedPrice ? <><span className={row.discountClass}>PKR.{row.unitPrice}</span> PKR.{row.discountedPrice}</> : <>PKR.{row.unitPrice}</>}</TableCell>
                                                                            <TableCell align="right">{row.quantity}</TableCell>
                                                                            <TableCell align="right">
                                                                                {row.discountedPrice ? <>PKR.{row.discountedPrice * row.quantity}</> : <>PKR.{row.totalPrice}</>}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                    <TableRow>
                                                                        <TableCell rowSpan={5} />
                                                                        <TableCell colSpan={3}>Subtotal</TableCell>
                                                                        <TableCell align="right">PKR.{finalPrice}</TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>Discount</TableCell>
                                                                        <TableCell colSpan={3} align="right">
                                                                            {billDiscountedPrice ? <>
                                                                                {coupon.type === 'Fixed Amount Discount' ? <>PKR.{coupon.amountOff}</> : <>PKR.{coupon.percentOff}%</>}
                                                                            </> : <>PKR.0</>}
                                                                        </TableCell>
                                                                        {/* <TableCell align="right">{finalPrice}</TableCell> */}
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell colSpan={3}>Total</TableCell>
                                                                        <TableCell align="right">
                                                                            {billDiscountedPrice ? <>PKR.{billDiscountedPrice}</> : <>PKR.{finalPrice}</>}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </Row>
                                                        <Row className="margin-global-top-1">
                                                            <Typography variant="h5" gutterBottom component="div">
                                                                Delivery Details
                                                            </Typography>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Typography variant="h6" gutterBottom component="div">
                                                                    Order Placed By
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.firstName} {row.lastName}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.email}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.phoneNumber}
                                                                </Typography>
                                                                <Typography variant="h6" gutterBottom>
                                                                    I am the receiver?
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.receiver ? 'Yes' : 'No'}
                                                                </Typography>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Call me incase of unavailable items to confirm my next best preferences?
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.callMe ? 'Yes' : 'No'}
                                                                </Typography>
                                                            </Col>
                                                            <Col>
                                                                <Typography variant="h6" gutterBottom component="div">
                                                                    Receiver Details
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.firstName1} {row.lastName1}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.email1}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.phoneNumber1}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.addressLine1}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.addressLine2}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    Landmark: {row.landmark ? row.landmark : '-'}
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.area}
                                                                </Typography>
                                                            </Col>
                                                        </Row>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        {/* </TableBody> */}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}