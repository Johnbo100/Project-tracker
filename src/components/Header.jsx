import React from 'react'

const Header = (props) => {
  return (

    <div className='header'>ACS-WEB Project Manager  <span class="status">{props.status}</span> </div>
   
  )
}

export default Header