export default function catchErrors(error, displayError) {
  let errorMsg;
  if (error?.response) {
    // the request was made and server responded with 
    // code other than 200's
    errorMsg = error.response.data;
    console.error("Error response", errorMsg);

    // for cloudinary image url error
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
      console.error("Error Cloudinary Response", errorMsg)
    }
  } else if (error.request) {
    // request was made but no response received
    errorMsg = error.request;
    console.error("Error request", errorMsg);
  } else {
    // something else happened that triggered an error
    errorMsg = error.message;
    console.error("Error message", errorMsg);
  }
  displayError(errorMsg)
}
