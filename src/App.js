import "./App.css";

import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar
} from "@material-ui/core";

import Alert from '@material-ui/lab/Alert';
import React from "react";
import TextField from "@material-ui/core/TextField";

function App() {
    const [vehicle, setVehicle] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [price, setPrice] = React.useState(0);
    const [pickup, setPickup] = React.useState("");
    const [delivery, setDelivery] = React.useState("");
    const [show, setShow] = React.useState(false);
    const [error, setError] = React.useState(false);

    const vehicle_dict = { 
        "bicycle": "Bicycle",
        "motorbike": "Motorbike",
        "parcel_car": "Parcel car",
        "small_van": "Small van",
        "large_van": "Large van",
    };

    const handleChange = (event) => {
        setVehicle(event.target.value);
        setShow(false);
    };

    const handlePickup = (event) => {
        setPickup(event.target.value);
        setShow(false);
    };

    const handleDelivery = (event) => {
        setDelivery(event.target.value);
        setShow(false);
    };

    const handleError = () => {
        setError(false);
    }

    const handleSubmit = () => {
        setOpen(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "pickupPostcode": pickup, 
                "deliveryPostcode": delivery,
                "vehicle": vehicle })
        };
        fetch("http://localhost:8080/quote", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    setOpen(false);
                    setShow(true);
                    setPrice(result.price);
                },
                (error) => {
                    setOpen(false)
                    setError(true);
                }
            )
    };

    return (
        <div className="App">
            <Backdrop className={"backdrop"} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
            <Grid item style={{ width: "80%" , maxWidth: "300px" }}>
            <form noValidate autoComplete="off">
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <TextField
                        id="filled-pickup"
                        label="Pickup Postcode"
                        className="text-field"
                        value={pickup}
                        onChange={handlePickup}
                    />
                    <TextField
                        id="filled-delivery"
                        label="Delivery Postcode"
                        className="text-field"
                        value={delivery}
                        onChange={handleDelivery}
                    />
                    <FormControl>
                        <InputLabel>
                            Vehicle
                        </InputLabel>
                        <Select
                            value={vehicle}
                            onChange={handleChange}
                        >
                            {
                                Object.keys(vehicle_dict).map((key) => (
                                    <MenuItem key={key} value={key}>{vehicle_dict[key]}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Button style={{ "margin": "10px 0" }} className="button" variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Box visibility={ show ? "visible" : "hidden" }>
                        A delivery from {pickup} to {delivery} using a {vehicle_dict[vehicle]} will cost you <b>£{price}</b>
                    </Box>
                </Box>
            </form>
            </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={3000} onClose={handleError}>
                <Alert severity="error" onClose={handleError}>Cannot connect to the server!</Alert>
            </Snackbar>
        </div>
    );
}

export default App;
