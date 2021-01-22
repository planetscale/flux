import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import * as Progress from '@radix-ui/react-progress';

const Wrapper = styled.div`
  width: 100vw;
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledProgress = styled(Progress.Root)`
  position: relative;
  height: 10px;
  width: 100%;
  max-width: 80ch;
  overflow: hidden;
  border-radius: 5px;
  background-color: var(--accent);
`;

const indeterminateProgressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100% }
`;

const StyledIndicator = styled(Progress.Indicator)`
  box-sizing: border-box;
  position: absolute;
  background-color: var(--highlight);
  height: 100%;
  animation-name: ${indeterminateProgressAnimation};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

export default function UserSelector() {
  return (
    <Wrapper>
      <StyledProgress>
        <StyledIndicator />
      </StyledProgress>
    </Wrapper>
  );
}
