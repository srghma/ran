import styled from 'styled-components';
import * as T from '~/components/Theme';

export const Main = styled.div`
  border-bottom: 1px solid #ececec;
  padding-bottom: 20px;
  margin-bottom: 20px;

  > h1 {
    font-size: 20px;
  }

  > input {
    display: block;
    margin-bottom: 10px;
  }
`;

export const SubmitButton = T.Button.extend`
  opacity: ${({ touched }) => (touched ? 1 : 0.5)};
`;