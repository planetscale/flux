import styled from '@emotion/styled';

const InputWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  line-height: 15px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0;
  border: unset;
  height: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 0.75px;
  margin: 8px 0 0;

  :focus {
    outline: none;
  }

  :disabled {
    color: #ccc;
    background-color: unset;
  }
`;

const StyledHelperText = styled.p((error = null, success = null) => {
  let color = '#000000';

  if (error) {
    color = 'red';
  } else if (success) {
    color = 'green';
  }

  return {
    fontSize: '14px',
    color,
    lineHeight: '16px',
    margin: `8px 0 0 0`,
  };
});

export default function Input({
  label,
  helperText,
  error,
  success,
  ...otherProps
}) {
  return (
    <InputWrapper>
      {label && <StyledLabel for={label}>{label}</StyledLabel>}
      <StyledInput id={label} {...otherProps} />
      {helperText && (
        <StyledHelperText error={error} success={success}>
          {helperText}
        </StyledHelperText>
      )}
    </InputWrapper>
  );
}
