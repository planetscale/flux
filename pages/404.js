import styled from '@emotion/styled';
import Head from 'next/head';

const EnjoyFlux = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: -1;
`;

const EnjoyFluxImage = styled.img``;

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Flux - PlanetScale - 404</title>
        <meta
          property="og:title"
          content="Flux - PlanetScale - 404"
          key="title"
        />
      </Head>
      <EnjoyFlux>
        <EnjoyFluxImage src="/404.png"></EnjoyFluxImage>
      </EnjoyFlux>
    </>
  );
}
