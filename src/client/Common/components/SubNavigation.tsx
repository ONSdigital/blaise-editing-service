import React, { ReactElement } from 'react';

interface NavigationProps {
  children: ReactElement;
}

export default function SubNavigationTemplate({ children }: NavigationProps) {
  function renderLinks() {
    const childrenList = [];

    React.Children.forEach(
      children,
      (child) => {
        childrenList.push(child);
      },
    );
    return (
      <li className="ons-navigation__item">
        {children}
      </li>
    );
  }

  return (
    <nav className="ons-navigation ons-navigation--sub ons-u-d-no@xxs@l" id="sub-nav" aria-label="Section menu" data-analytics="header-section-navigation">
      <div className="ons-page__container ons-container ons-container--gutterless@xxs@l">
        <ul className="ons-navigation__list ons-navigation__list">
          {renderLinks()}
        </ul>
      </div>
    </nav>
  );
}
