import { styled } from '@mui/material/styles';
import { useEffect, useState, type ReactNode } from 'react';
import AnimateHeight, { type Height } from 'react-animate-height';

import { ButtonBase } from '../shared/custom-button-base.tsx';

type NavComponentProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  $isExpanded?: boolean;
  $disabled?: boolean;
};

type ComponentWrapperProps = {
  $disabled: boolean;
};

const NavComponentWrapper = styled('li')<ComponentWrapperProps>`
  color: ${({ theme }) => theme.pureWhite};
  padding: 0 2px;

  ${({ $disabled, theme }) =>
    $disabled &&
    `color: ${theme.disabledGray};
     pointer-events: none;
     cursor: default;
    `}
`;

const HoverWrapper = styled(ButtonBase)`
  background-color: unset;
  border: none;
  color: inherit;
  cursor: pointer;
  height: 100%;
  padding: 0.5rem 1rem;
  text-align: inherit;
  width: 100%;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.menuHover};
    background-color: ${({ theme }) => theme.menuHighlight};
  }
`;

const NavTitle = styled('span')`
  margin-left: 0.5rem;
`;

const ExpandArrow = styled('span')<{ $isOpen: boolean }>`
  border-color: currentColor;
  border-style: solid;
  border-width: 0 1.5px 1.5px 0;
  display: inline-block;
  height: 0.36rem;
  margin-left: auto;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '45deg' : '-45deg')});
  transition: transform 180ms ease;
  width: 0.36rem;
`;

const ChildrenWrapper = styled('ul')`
  padding-left: 2rem;
`;

export const NavComponent = ({
  title,
  icon,
  children,
  $isExpanded = false,
  $disabled = false
}: NavComponentProps) => {
  const [isOpen, setIsOpen] = useState($isExpanded);
  const height: Height = isOpen ? 'auto' : 0;

  useEffect(() => {
    setIsOpen($isExpanded);
  }, [$isExpanded]);

  return (
    <NavComponentWrapper $disabled={$disabled}>
      <HoverWrapper
        disabled={$disabled}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        {icon}
        <NavTitle>{title}</NavTitle>
        <ExpandArrow $isOpen={isOpen} aria-hidden="true" />
      </HoverWrapper>

      <AnimateHeight duration={350} easing="ease-in-out" height={height}>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </AnimateHeight>
    </NavComponentWrapper>
  );
};
