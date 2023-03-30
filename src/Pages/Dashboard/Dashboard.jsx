import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import Modal from "@mui/material/Modal";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";
import QRDailog from "../../components/Dailog/QRDailog";
import RedoIcon from '@mui/icons-material/Redo';
import { toast } from "react-toastify";
const Dashboard = ({setQrImg,QrImg}) => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [isLoading,setLoding] = useState(false)
  const [success,setSuccess] = useState(false)
  const [image,setImage] = useState('')
  const [view,setView] = useState(false)
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1.5px solid #F1AB15",
    boxShadow: 24,
    p: 4,
  };
  const navigate = useNavigate();
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const mode = JSON.parse(sessionStorage.getItem("mode"));
  const authCheck = JSON.parse(sessionStorage.getItem("authCheck"));
  const response = JSON.parse(sessionStorage.getItem("response"));
  useEffect(() => {
    if (mode?.mode != null) {
    if(mode?.mode==='ID'){
      if (auth != null) {
        if (auth.verificationResult === null) {
          navigate("/");
        }
        if (auth.verificationResult === false || !auth.verificationResult) {
          navigate("/");
        }
      } else if (auth === null) {
        navigate("/");
      }
    }
    else if (mode?.mode==='QR'){
      if (authCheck != null) {
        if (authCheck.statusCode === null) {
          navigate("/");
        }
        if (authCheck.statusCode == 400 || !authCheck.statusCode) {
          navigate("/");
        }
      }
      else if (authCheck === null) {
        navigate("/");
      }
    }
  }
    // else if (mode===null){
    //   navigate('/')
    // }
    else{
      navigate("/");
    }
  }, []);
  const [data,setData] = useState()
  const [details,setDetails] = useState({
    nom:'',
    prenoms:'',
    sexe:'',
    date_naissance:'',
    lieu_naissance:'',
    pere:'',
    mere:''
  })
  useEffect(()=>{
    if (mode?.mode==='QR'){
    fetch("https://eservices.aptiway.com/api/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `documentNumber=${authCheck?.Document_Number}`,
        })
          .then(function (response) {
            return response?.json();
          })
          .then(function (data) {
            const response = JSON.stringify(data);
            setDetails({
              nom:data?.userData[0]?.lastName,
              prenoms:data?.userData[0]?.firstName,
              sexe:data?.userData[0]?.gender,
              date_naissance:data?.userData[0]?.date_of_birth,
              lieu_naissance:data?.userData[0]?.place_of_birth,
              pere:'',
              mere:''
            })
            setData(data)
            sessionStorage.setItem("response", response);
          });
        }
    if (mode?.mode==='ID'){
    fetch("https://eservices.aptiway.com/api/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `documentNumber=${response?.userData[0]?.documentNumber}`,
        })
          .then(function (response) {
            return response?.json();
          })
          .then(function (data) {
            const response = JSON.stringify(data);
            setDetails({
              nom:data?.userData[0]?.lastName,
              prenoms:data?.userData[0]?.firstName,
              sexe:data?.userData[0]?.gender,
              date_naissance:data?.userData[0]?.date_of_birth,
              lieu_naissance:data?.userData[0]?.place_of_birth,
              pere:'',
              mere:''
            })
            setData(data)
            sessionStorage.setItem("response", response);
          });
        }
  },[])
 const handleSubmit = ()=>{
  if(details?.nom?.length===0 || details?.prenoms?.length===0 || details?.date_naissance?.length===0 || details?.lieu_naissance?.length===0 ){
    alert('Please Fill All Fields')
  }
  else{
    // alert(JSON.stringify(details))
    setLoding(true)
    fetch("cndigit/naissance/recherche",{
    method:'POST',
    headers:{Apikey:'e9a0f2fb63eee405de8a30ffd361b6c6'},
    body:JSON.stringify(details)
    // body:JSON.stringify({
    //   "nom"				: "KAMARA",			
    //   "prenoms"			: "Mamadou",		
    //   "sexe"				: "M",				
    //   "date_naissance"	: "22/06/1996",		
    //   "lieu_naissance"	: "Treichville",	
    //   "pere"				: "",				
    //   "mere"				: ""				
    // })
    }).then(function(response){
      return response.json()
    }).then(function(data){
      // console.log(data.message)
      if(data?.errorCode==='000'){
        setSuccess(true)
        setImage(data?.pdfacte)
        setLoding(false)
        const dataa = {
          documentNumber: response?.userData[0]?.documentNumber,
          name: response?.userData[0]?.firstName,
          document: data?.pdfacte
        };
        const params = new URLSearchParams();
for (const [key, value] of Object.entries(dataa)) {
  params.append(key, value);
}
        fetch("https://eservices.aptiway.com/api/upload_doc.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params
        })
          .then(function (response) {
            return response?.json();
          })
          .then(function (data) {

          })
        handleClose1()
      }
      else{
        setLoding(false)
        alert(data?.message)
      }
    })
  }
 }
 const handleViewClick = ()=>{
  // setView(true)
  setSuccess(true)
  handleClose2()
 }
  return (
    <div style={{ position: "relative" }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{zIndex: 9999998}}
      >
        
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Demo Service
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            For Testing.
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{zIndex: 9999998}}
      >
        
        <Box sx={style} style={{'display':'flex',justifyContent:'space-between'}}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            View Birth Certificate
          </Typography>
            <IconButton onClick={()=>{handleViewClick()}}>
              <RedoIcon color={'primary'} width={'2rem'} height={'2rem'}/>
            </IconButton>
        </Box>
      </Modal>
      <Modal
        open={open1}
        onClose={handleClose1}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        style={{zIndex: 9999998}}
      >
        
        <Box sx={style} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
          {/* <Typography id='modal-modal-title' variant='h6' component='h2'>
            Demo Servicesssss
          </Typography>*/}
          {isLoading ? <Box display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'} height={'480px'}><CircularProgress/></Box>:
         <Box display={'flex'} flexDirection={'column'} gap={2} width={'100%'}>
         <Typography id='modal-modal-description'  textAlign={'center'} fontWeight={'600'} fontSize={'1.5rem'} color={'#F1AB15'}>
            Personal Details
          </Typography> 
           <TextField
                  size="small"
                  required
                  label="nom"
                  name="nom"
                  value={details?.nom}
                  fullWidth
                  onChange={(e)=>{
                    setDetails({...details,nom:e?.target?.value})
                  }}
                />
           <TextField
                  size="small"
                  required
                  label="prenoms"
                  name="prenoms"
                  value={details?.prenoms}
                  onChange={(e)=>{
                    setDetails({...details,prenoms:e?.target?.value})
                  }}
                  fullWidth
                />
           <TextField
                  size="small"
                  required
                  label="sexe"
                  name="sexe"
                  value={details?.sexe}
                  onChange={(e)=>{
                    setDetails({...details,sexe:e?.target?.value})
                  }}
                  fullWidth
                />
           <TextField
                  size="small"
                  required
                  label="date_naissance"
                  name="date_naissance"
                  value={details?.date_naissance}
                  onChange={(e)=>{
                    setDetails({...details,date_naissance:e?.target?.value})
                  }}
                  fullWidth
                  inputProps={{ autocomplete: "off" }}
                />
                <TextField
                  size="small"
                  required
                  label="lieu_naissance"
                  name="lieu_naissance"
                  value={details?.lieu_naissance}
                  onChange={(e)=>{
                    setDetails({...details,lieu_naissance:e?.target?.value})
                  }}
                  fullWidth
                  inputProps={{ autocomplete: "off" }}
                />
           <TextField
                  size="small"
                  required
                  label="pere"
                  name="pere"
                  value={details?.pere}
                  onChange={(e)=>{
                    setDetails({...details,pere:e?.target?.value})
                  }}
                  fullWidth
                  inputProps={{ autocomplete: "off" }}
                />
           <TextField
                  size="small"
                  required
                  label="mere"
                  name="mere"
                  value={details?.mere}
                  fullWidth
                  onChange={(e)=>{
                    setDetails({...details,mere:e?.target?.value})
                  }}
                  inputProps={{ autocomplete: "off" }}
                />
               <Box display={'flex'} justifyContent={'space-between'}>
               <Button variant="contained" type="submit" style={{'color':'white',width:'45%'}} onClick={handleClose1}>
                  cancel
                </Button>
               <Button variant="contained" type="submit" style={{'color':'white',width:'45%'}} onClick={handleSubmit}>
                  SUBMIT
                </Button>
                
               </Box>
         </Box>}
        </Box>
      </Modal>

      <QRDailog setQrImg={setQrImg} QrImg={QrImg} />
      {success ? <div>
        <Button variant="contained" style={{'float':'right',marginBottom:'1rem',color:'white'}} onClick={()=>{setSuccess(false)}}>
          Back to Dashboard
        </Button>
        {/* {image?.length || response?.userData[0]?.doc} */}
       <embed style={{'width':'100%',height:'75rem'}} src={image?.length
                ? `data:application/pdf;base64,${image}` : response?.userData[0]?.doc} />
      </div> : <>
      <Typography
        variant='h6'
        sx={{ mb: 3 }}
        textAlign={"left"}
        fontFamily={"sans-serif"}
        color={"#F1AB15"}
      >
        Services
      </Typography>
      <Grid container>
        <Grid
          container
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap='wrap'
        >
          <Grid item>
            <Card sx={{ width: "12rem" }}>
              <CardContent
                sx={{
                  border: "1px solid burlywood",
                  backgroundColor: "#EFEFF1",
                }}
              >
                <Box style={{ textAlign: "center" }}>
                  <DescriptionIcon style={{ height: "2rem", width: "2rem" }} />
                </Box>
                <Typography
                  gutterBottom
                  variant='h7'
                  component='div'
                  marginTop={"1rem"}
                  style={{ textAlign: "center" }}
                >
                  Birth Certificate
                </Typography>
                <Typography variant='body2' color='text.secondary'></Typography>
                <CardActions
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    size='small'
                    variant='outlined'
                    // sx={{ backgroundColor: "burlywood" }}

                    onClick={handleOpen1}
                  >
                    Start Service
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>

          <Grid item>
            <Card sx={{ width: "12rem" }}>
              <CardContent
                sx={{
                  border: "1px solid burlywood",
                  backgroundColor: "#EFEFF1",
                }}
              >
                <Box style={{ textAlign: "center" }}>
                  <LinkIcon style={{ height: "2rem", width: "2rem" }} />
                </Box>
                <Typography
                  gutterBottom
                  variant='h7'
                  component='div'
                  marginTop={"1rem"}
                  style={{ textAlign: "center" }}
                >
                  UseFull Links
                </Typography>
                <Typography variant='body2' color='text.secondary'></Typography>
                <CardActions
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    size='small'
                    variant='outlined'
                    // sx={{ backgroundColor: "primary" }}
                    onClick={handleOpen2}
                  >
                    Start Service
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ width: "12rem" }}>
              <CardContent
                sx={{
                  border: "1px solid burlywood",
                  backgroundColor: "#EFEFF1",
                }}
              >
                <Box style={{ textAlign: "center" }}>
                  <ArticleOutlinedIcon
                    style={{ height: "2rem", width: "2rem" }}
                  />
                </Box>
                <Typography
                  gutterBottom
                  variant='h7'
                  component='div'
                  marginTop={"1rem"}
                  style={{ textAlign: "center" }}
                >
                  News
                </Typography>
                <Typography variant='body2' color='text.secondary'></Typography>
                <CardActions
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    size='small'
                    variant='outlined'
                    // sx={{ backgroundColor: "burlywood" }}
                    onClick={handleOpen}
                  >
                    Start Service
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ width: "12rem" }}>
              <CardContent
                sx={{
                  border: "1px solid burlywood",
                  backgroundColor: "#EFEFF1",
                }}
              >
                <Box style={{ textAlign: "center" }}>
                  <ControlPointIcon style={{ height: "2rem", width: "2rem" }} />
                </Box>
                <Typography
                  gutterBottom
                  variant='h7'
                  component='div'
                  marginTop={"1rem"}
                  style={{ textAlign: "center" }}
                >
                  Other Services
                </Typography>
                <Typography variant='body2' color='text.secondary'></Typography>
                <CardActions
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    size='small'
                    variant='outlined'
                    // sx={{ backgroundColor: "burlywood" }}
                    onClick={handleOpen}
                  >
                    more
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Typography
        // sx={{ mt: 3, mb: 3, paddingLeft: 1.8 }}
        textAlign={"left"}
        variant='h6'
        sx={{ mt: 3, mb: 3 }}
        fontFamily={"sans-serif"}
        color={"#F1AB15"}
      >
        Recently Used
      </Typography>
      <Grid container>
        <Grid
          container
          display={"flex"}
          justifyContent={"flex-start"}
          gap={2}
          sx={{ pl: 1 }}
        >
          <Grid item>
            <Card sx={{ width: "12rem" }}>
              <CardContent
                sx={{
                  border: "1px solid burlywood",
                  backgroundColor: "#EFEFF1",
                }}
              >
                <Box style={{ textAlign: "center" }}>
                  <DescriptionIcon style={{ height: "2rem", width: "2rem" }} />
                </Box>
                <Typography
                  gutterBottom
                  variant='h7'
                  component='div'
                  marginTop={"1rem"}
                  style={{ textAlign: "center" }}
                >
                  Documents
                </Typography>
                <Typography variant='body2' color='text.secondary'></Typography>
                <CardActions
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    size='small'
                    variant='outlined'
                    // sx={{ backgroundColor: "burlywood" }}

                    onClick={handleOpen}
                  >
                    Start Service
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid></>}
    </div>
  );
};

export default Dashboard;
