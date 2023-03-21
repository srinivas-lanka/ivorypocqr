import { useState, useCallback, useEffect } from "react";
// import LoadingSpinner from "../../components/Common/Spinner";
import image from "../../assets/app_logo.png";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";

import PersonIcon from "@mui/icons-material/Person";
const Login = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isValid, setValid] = useState(false);

  const validate = useCallback(() => {
    return mobile.length;
  }, [mobile.length]);

  useEffect(() => {
    if (mobile.length === 9) {
      const isValid = validate();
      setValid(isValid);
    }
  }, [mobile.length, validate]);

  const handleNumber = e => {
    if (!e.target.validity.patternMismatch) {
      setMobile(e.target.value);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common.authorization = "";
    sessionStorage.clear();
  }, []);

  const HandelSubmit = useCallback(
    async e => {
      e.preventDefault();
      if (!mobile.length) {
        toast.error("please enter ID number");
      } else {
        setIsLoading(true);
        fetch("https://efreshsoftwares.in/ivrdigital/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `documentNumber=${mobile}`,
        })
          .then(function (response) {
            return response?.json();
          })
          .then(function (data) {
            const response = JSON.stringify(data);
            sessionStorage.setItem("response", response);
            setIsLoading(false);
            if (data.statusCode == 200) {
              navigate(PATHS.face);
            } else if (data.statusCode == 400) {
              toast.error("Entered ID number is incorrect");
            }
          });
      }
    },
    [mobile],
  );
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      id='contentContainer'
    >
      <Box
        width={"65%"}
        height={"75%"}
        style={{ backgroundColor: "#f6f4ed" }}
        boxShadow={5}
        borderRadius={3}
        borderLeft={"10px solid #bd6100"}
        display={"flex"}
      >
        <Box
          width={"50%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <img
            width={"40%"}
            src={image}
            alt='logo'
            style={{ marginTop: "-2rem" }}
          />
          <Typography
            fontWeight={600}
            textTransform={"uppercase"}
            marginTop={"1.5rem"}
            border={"1px solid black"}
            padding={"0.6rem"}
            borderRadius={"12px"}
            backgroundColor={"white"}
            fontSize={"1.2rem"}
            color={"#bd6100"}
          >
            République de Côte d'Ivoire
          </Typography>
          <Typography
            marginTop={"1rem"}
            fontWeight={600}
            width={"70%"}
            textAlign={"center"}
          >
            A single trusted digital identity for all citizens, residents and
            visitors.
          </Typography>
        </Box>
        <Box
          borderRight={"1px solid #bd6100"}
          height={"88%"}
          marginTop={"3.5%"}
        ></Box>
        {isLoading ? (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"50%"}
          >
            {" "}
            <CircularProgress color='info' />
          </Box>
        ) : (
          <Box
            width={"50%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              textAlign={"center"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <Typography
                color={"#bd6100"}
                fontSize={"1.8rem"}
                fontWeight={600}
              >
                Login to smart services
              </Typography>
              <Typography
                color={"#bd6100"}
                fontWeight={600}
                textAlign={"center"}
                marginTop={"2rem"}
              >
                Please Enter ID Number
              </Typography>
              <TextField
                color={"info"}
                type='text'
                inputProps={{ autocomplete: "off" }}
                variant='outlined'
                style={{ width: "100%", marginTop: "1rem" }}
                label={"ID Number"}
                onChange={handleNumber}
                value={mobile || ""}
                pattern='^[0-9]*$'
                required
              />
              <Button
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "#bd6100",
                  color: "white",
                }}
                onClick={HandelSubmit}
              >
                SUBMIT
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Login;
