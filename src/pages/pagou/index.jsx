import React from 'react'
import { Link } from 'react-router-dom'

const Pagou = () => {
  return (
    <>
        <h1>Obrigado pela sua compra!</h1>
        <Link to={'/'}>Voltar ao index</Link>
    </>
  )
}

export {Pagou}