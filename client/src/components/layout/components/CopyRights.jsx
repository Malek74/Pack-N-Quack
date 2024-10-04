import React from 'react'
import { useMemo } from "react";

const CopyRights = () => {
    const year = useMemo(() => {
        return new Date().getFullYear();
      }, []);
  return (
    <>
        <p className="font-extralight text-center text-xs p-2"> ©Copyrights {year} all rights reserved</p>
    </>
  )
}

export default CopyRights