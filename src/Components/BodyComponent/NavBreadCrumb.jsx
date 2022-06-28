import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const NavBreadCrumb = ({ path, name }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href={path}>
        {name}
      </Link>
    </Breadcrumbs>
  );
};

export default NavBreadCrumb;
