import { useState, useCallback, useEffect } from "react";
// import LoadingSpinner from "../../components/Common/Spinner";
import image from "../../assets/app_logo.png";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";
import { toast } from "react-toastify";
import ReplayIcon from "@mui/icons-material/Replay";
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
  const [qr, setQr] = useState("");
  const [qrText, setQrText] = useState("");
  const [code, setCode] = useState(400);

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
    sessionStorage.removeItem('qrCheck');
    sessionStorage.removeItem('QRresponse');
  }, []);
  const [num, setNum] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [num3, setNum3] = useState(0);
  const [login,setLogin] = useState(false)
  const authCheck = JSON.parse(sessionStorage.getItem("authCheck"));
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const HandelSubmit = useCallback(
    async e => {
      e.preventDefault();
      if (!mobile.length) {
        toast.error("please enter ID number");
      } else {
        const response = JSON.stringify({mode:'ID'})
        sessionStorage.setItem("mode", response);
        setIsLoading(true);
        fetch("https://eservices.aptiway.com/api/login.php", {
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
  useEffect(()=>{
    if(authCheck!=null){
      if(authCheck?.statusCode==200){
        navigate('/dashboard')
      }
    }
    else if (authCheck===null){
     
    }
  },[authCheck])
  useEffect(()=>{
    if(auth!=null){
      if(auth?.verificationResult==true){
        navigate('/dashboard')
      }
    }
    else if (auth===null){
     
    }
  },[auth])
  const RegenerateQR = useCallback(
    e => {
      fetch("https://eservices.aptiway.com/api/qr_generator.php")
        .then(function (response) {
          return response?.json();
        })
        .then(function (data) {
          const response = JSON.stringify(data);
          sessionStorage.setItem("QRresponse", response);
          setQr("https://eservices.aptiway.com/api/" + data.QR);
          setQrText(data?.Qrtext?.ID);
        });
      setNum(num + 1);
      setCode(400);
    },
    [mobile],
  );

  // useEffect(() => {
  //   fetch("https://eservices.aptiway.com/api/qr_generator.php")
  //     .then(function (response) {
  //       return response?.json();
  //     })
  //     .then(function (data) {
  //       const response = JSON.stringify(data);
  //       setQr(  "https://eservices.aptiway.com/api/" + data.QR);
  //       setQrText(data?.Qrtext?.ID);
  //       sessionStorage.setItem("QRresponse", response);
  //     });
  // }, []);
  useEffect(() => {
    setTimeout(() => {
      setNum(num + 1);
    }, 120000);
    if (code == 400 && num3 == 0) {
      console.log('auto generate')
      fetch("https://eservices.aptiway.com/api/qr_generator.php")
        .then(function (response) {
          return response?.json();
        })
        .then(function (data) {
          const response = JSON.stringify(data);
          setQr("https://eservices.aptiway.com/api/" + data.QR);
          setQrText(data?.Qrtext?.ID);
          // console.log(data?.Qrtext?.ID)
          sessionStorage.setItem("QRresponse", response);
        });
      setCode(400);
    }
    else{
      return
    }
  }, [num,code,num3]);

  // useEffect(() => {
  //   fetch(`https://efreshsoftwares.in/ivrdigital/check_authstatus.php`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: `qr_code=${qrText}`,
  //   }).then(res => {
  //     console.log("res5645464:", res);
  //   });
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setNum1(num1 + 1);
    }, 5000);
    if (qrText && code == 400) {
      fetch(`https://eservices.aptiway.com/api/checkqr_status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `qr_id=${qrText}`,
      })
        .then(function (response) {
          return response?.json();
        })
        .then(function (data) {
          const response = JSON.stringify(data);
          sessionStorage.setItem("qrCheck", response);
          // setCode(data?.statusCode);
          if (data.statusCode === 200) {
            setIsLoading(true);
            setCode(200)
            setNum3(200)
            const response = JSON.stringify({mode:'QR'})
            sessionStorage.setItem("mode", response);
          } else {
            // setIsLoading(true)
            // console.log('scanned')
          }
          // const response = JSON.stringify(data);
          // setQr(  "https://eservices.aptiway.com/api/"+data.QR)
          // sessionStorage.setItem("response", response);
        });
      }
    }, [qrText, num1]);
    useEffect(()=>{
      setTimeout(() => {
        setNum2(num2 + 1);
      }, 5000);
    if(code==200){
    fetch(`https://eservices.aptiway.com/api/check_authstatus.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `qr_code=${qrText}`,
    })
      .then(function (response) {
        return response?.json();
      })
      .then(function (data) {
        const response = JSON.stringify(data);
       
        // setCode(data?.statusCode);
        if (data.statusCode == 200) {
          // setIsLoading(true);
          navigate('/dashboard')
          
          sessionStorage.setItem("authCheck", response);
          window.location.reload()
          
        } else if(data.statusCode == 500){
          toast.error("Authentication failed, face mismatch");
          setIsLoading(false)
          sessionStorage.clear()
          setQrText('')
          RegenerateQR()
        }
        // const response = JSON.stringify(data);
        // setQr(  "https://eservices.aptiway.com/api/"+data.QR)
        // sessionStorage.setItem("response", response);
      });
    }
  },[code,num2])
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
        height={"85%"}
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
                marginTop={"1rem"}
              >
                Please scan the QR Code
              </Typography>
              {/* <TextField
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
              /> */}
              {/* <Box > */}
              <img
                src={qr}
                alt=''
                width={"40%"}
                height={"40%"}
                style={{ cursor: "none", mixBlendMode: "color-burn" }}
              />
              {/* <img src={image2} alt="" style={{ position:'absolute',
                  top:'55px',
                  right:'125px',backgroundColor:'#bd6100',width:'13%',objectFit:'cover'}} /> */}

              <Button
                // startIcon={<ReplayIcon/>}
                style={{
                  width: "70%",
                  // width: "auto",
                  // width:'1rem',
                  // height:'1rem',
                  marginTop: "1rem",
                  backgroundColor: "#bd6100",
                  color: "white",

                  // borderRadius:'100%'
                }}
                size='small'
                onClick={RegenerateQR}
              >
                Re generate QR
              </Button>

              <Typography
                color={"#bd6100"}
                sx={{ paddingTop: 2 }}
                fontWeight={500}
              >
                OR
              </Typography>
              <Typography
                color={"#bd6100"}
                fontWeight={600}
                textAlign={"center"}
                // marginTop={"2rem"}
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
                  width: "70%",
                  marginTop: "1rem",
                  backgroundColor: "#bd6100",
                  color: "white",
                }}
                size='small'
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
