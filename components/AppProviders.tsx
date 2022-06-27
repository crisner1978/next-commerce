import ProgressBar from "@badrap/bar-of-progress";
import { Router } from "next/dist/client/router";
import React from 'react';
import Header from './Header';

const progress = new ProgressBar({
  size: 4,
  color: "#2563eb", 
  className: "z-50",
  delay: 80,
})

Router.events.on("routeChangeStart", progress.start)
Router.events.on("routeChangeComplete", progress.finish)
Router.events.on("routeChangeError", progress.finish)

interface Props {
  children: React.ReactNode
}

const AppProviders = ({ children }: Props) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default AppProviders
