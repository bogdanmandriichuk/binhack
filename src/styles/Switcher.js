import React from 'react';
import styled from 'styled-components';

const SwitcherWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`;

const SwitcherLabel = styled.span`
  font-size: 1rem;
  color: white; /* Змінено на білий колір */
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Додано легку тінь для читабельності */
`;

const SwitcherContainer = styled.div`
  width: 45px;
  height: 25px;
  background-color: ${(props) => (props.$isOn ? '#FFC107' : '#ccc')}; /* Змінено на жовто-оранжевий для ON, сірий для OFF */
  border-radius: 15px;
  position: relative;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Додано тінь для контейнера */
`;

const SwitcherHandle = styled.div`
  width: 21px;
  height: 21px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transform: translateX(${(props) => (props.$isOn ? '20px' : '0')});
  transition: transform 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Тінь для ручки */
`;

const Switcher = ({ label, isOn, onToggle, disabled }) => {
  return (
    <SwitcherWrapper onClick={disabled ? null : onToggle} disabled={disabled}>
      <SwitcherLabel>{label}</SwitcherLabel>
      <SwitcherContainer $isOn={isOn}>
        <SwitcherHandle $isOn={isOn} />
      </SwitcherContainer>
    </SwitcherWrapper>
  );
};

export default Switcher;