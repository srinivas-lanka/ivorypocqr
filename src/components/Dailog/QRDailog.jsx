import React from "react";
import { Dialog, Button, DialogContent, DialogTitle, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback } from "react";
const QRDailog = ({ setQrImg, QrImg }) => {
  const face = "SAd";
  const profile_pic = "SAd";
  const response = JSON.parse(sessionStorage.getItem("response"));
  const handleClose = useCallback(() => {
    setQrImg(prev => !prev);
  }, [setQrImg]);

  return (
    <Dialog open={!!QrImg} onClose={handleClose}>
      <DialogContent>
        <Box
          style={{ textAlign: "center" }}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CloseIcon
            sx={{ mb: 3, cursor: "pointer" }}
            onClick={() => handleClose()}
          />
          <img
            alt='profile_pic'
            src={
              face?.length
                ? `${
                    "https://eservices.aptiway.com/api/" +
                    response?.userData[0]?.qr_image
                  }`
                : profile_pic
            }
            style={{
              width: "350px",
              height: "350px",
              objectFit: "contain",
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default QRDailog;
