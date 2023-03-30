import HandleRoutes from "./Routes/HandleRoutes";
import { ToastContainer } from "react-toastify";
import {useState} from 'react'
const App = () => {
  const [QrImg,setQrImg] = useState(false)
  return (
    <>
      <ToastContainer
        closeOnClick={true}
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
      />

      <HandleRoutes QrImg={QrImg} setQrImg={setQrImg}/>
    </>
  );
};

export default App;
