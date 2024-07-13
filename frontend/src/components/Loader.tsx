import React from 'react'
import {Oval} from 'react-loader-spinner'

type LoaderProps = {
    height:string;
    width:string;
    color:string;
}

const Loader = ({height,width,color}:LoaderProps) => {
  return (
    <>
    <Oval
    visible={true}
     color={color}
     height={height}
     width={width}
     secondaryColor='white'
     ariaLabel='oval-loading'
     wrapperClass=''
     wrapperStyle={{}}
    />
    </>
  )
}

export default Loader