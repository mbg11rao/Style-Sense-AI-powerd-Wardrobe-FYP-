import React from "react";
import GIF from "../assets/Home Video.mp4";
import styled from "styled-components";

const VideoContainer = styled.div`
  width: 100%;

  video {
    width: 100%;
    height: auto;
  }

  @media (max-width: 64em) {
    min-width: 40vh;
  }
`;

const CoverVideo = () => {
  return (
    <VideoContainer>
      <video src={GIF} type="video/mp4" autoPlay muted loop />
    </VideoContainer>
  );
};

export default CoverVideo;
