import { DefaultErrorBoundary, Footer, Header } from "blaise-design-system-react-components";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const divStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
};

interface LayoutTemplateProps {
  children: React.ReactNode;
  showSignOutButton: boolean;
  signOut: () => void;
}

function NavLink({ id, label, endpoint }: { id?: string; label: string; endpoint: string }) {
  return (
    <Link
      to={endpoint}
      id={id}
      className="ons-navigation__link"
    >
      {label}
    </Link>
  );
}

export default function LayoutTemplate({
  children,
  showSignOutButton,
  signOut,
}: LayoutTemplateProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={divStyle}>
      <Header
        title="Blaise Editing Service"
        noSave
        signOutButton={showSignOutButton}
        signOutFunction={() => {
          signOut();
          navigate("/");
        }}
        navigationLinks={[{ id: "home-link", label: "Home", endpoint: "/" }]}
        currentLocation={location.pathname}
        createNavLink={(id: string | undefined, label: string, endpoint: string) => (
          <NavLink
            id={id}
            label={label}
            endpoint={endpoint}
          />
        )}
      />

      <DefaultErrorBoundary>
        <div
          style={contentStyle}
          className="ons-page__container ons-container"
          data-testid="app-content"
        >
          {children}
        </div>
      </DefaultErrorBoundary>
      <Footer />
    </div>
  );
}
