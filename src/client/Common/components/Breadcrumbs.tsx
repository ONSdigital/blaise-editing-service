import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  link: string
  title: string
}

interface Props {
  BreadcrumbList: BreadcrumbItem[]
}

function Breadcrumbs({ BreadcrumbList }: Props): ReactElement {
  return (
    <nav className="ons-breadcrumb" aria-label="Breadcrumb">
      <ol className="ons-breadcrumb__items u-fs-s">
        {
                    BreadcrumbList.map((breadCrumbItem: BreadcrumbItem, index) => (
                      <li className="ons-breadcrumb__item" id={`breadcrumb-${index}`} data-testid={`breadcrumb-${index}`} key={`breadcrumb-${breadCrumbItem.link}`}>
                        <Link className="ons-breadcrumb__link" to={breadCrumbItem.link}>{breadCrumbItem.title}</Link>
                        <svg
                          className="ons-svg-icon"
                          viewBox="0 0 8 13"
                          xmlns="http://www.w3.org/2000/svg"
                          focusable="false"
                        >
                          <path
                            d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
                            transform="translate(-5.02 -1.59)"
                          />
                        </svg>
                      </li>
                    ))
                }
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
