import React from "react";

const Loader = () => {
  return (
    <div style={{width:'80vw',height:'5vh',margin: '2rem 0'}}>
      <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_wxf7kpgo.json"  background="transparent"  speed="1"  style={{transform:'scale(5)'}} loop  autoplay></lottie-player>
    </div>
  );
};

export default Loader;
