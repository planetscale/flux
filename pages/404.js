import styled from '@emotion/styled';
import CustomLayout from 'components/CustomLayout';

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
    <CustomLayout title="404">
      <EnjoyFlux>
        <EnjoyFluxImage src="/404.png"></EnjoyFluxImage>
      </EnjoyFlux>
    </CustomLayout>
  );
}
