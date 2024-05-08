/* eslint-disable prettier/prettier */

import React from 'react';
import styled from 'styled-components/native';

const Input = styled.TextInput.attrs({
  placeholderTextColor: '#8ECFAD',
})`
    width: 100%;
    height: ${(props:any) => props.theme.sizes[5]};
    margin-bottom: ${(props:any) => props.theme.space[3]};
    padding-left: ${(props:any) => props.theme.space[9]};
    padding-right: ${(props:any) => props.theme.space[3]};
    padding-top: ${(props:any) => props.theme.space[2]}
    padding-bottom: ${(props:any) => props.theme.space[2]}
    font-size: ${(props:any) => props.theme.sizes[1]};
    background: rgba(255, 255, 255, 0.96);
    border-radius: 4px;
    font-size: ${(props:any) => props.theme.fontSizes.text};
     color: ${(props:any) => props.theme.colors.text.tertiary};
`;
// const InputLabel = styled.Text`
//   text-align: left;
//   margin-left: ${(props:any) => props.theme.space[3]};
//   margin-bottom: ${(props:any) => props.theme.space[2]};
//   padding-top: ${(props:any) => props.theme.space[2]};
//   font-size: ${(props:any) => props.theme.fontSizes.text};
//   color: ${(props:any) => props.theme.colors.text.dark};
// `;

const InputForm = ({onChangeText, ...props}) => {
  return (
    <>
      <Input onChangeText={onChangeText} {...props} />
    </>
  );
};

export default InputForm;
