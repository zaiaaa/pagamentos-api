import React, { useReducer, useState,  } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';

const api = axios.create({
  baseURL: "https://api.mercadopago.com"
})

api.interceptors.request.use(async config => {
  const token = process.env.REACT_APP_ACCESS_TOKEN_MERCADO_PAGO
  config.headers.Authorization = `Bearer ${token}`

  return config
})

const formReducer = (state, event) => {
  return{
    ...state,
    [event.name]: event.value
  }
}


const Home = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useReducer(formReducer, {})
  const [responsePayment, setResponsePayment] = useState(false)
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState(false)
  const [statusPayment, setStatusPayment] = useState(false)

  const handleChange = event => {
    setFormData({
      name: event.target.name,
      value: event.target.value
    })
  }

  const getStatusPayment = () => {
    api.get(`v1/payments/${responsePayment.data.id}`).then(response => {
      console.log('chequei')
      if (response.data.status === "approved"){
        setStatusPayment(true)
        navigate('/pagou')
      }else{
        setTimeout(getStatusPayment, 2000)
      }
    }).catch(err => {
      console.error('Erro ao obter status do pagamento: ', err, ' Tentando novamente...')

      setTimeout(getStatusPayment, 2000);
    })
  }

  const handleSubmit = (event) =>{
    event.preventDefault();
    // console.log(formData)

    const body = {
      "transaction_amount": 0.10,
        "description": "Vaga no CBPATIO",
        "payment_method_id": 'pix',
            "payer": {
            "email": "eliete_zaia@yahoo.com.br",
            "first_name": "Eliete",
            "last_name": "Zaia",
            "identification": {
              "type": "CPF",
              "number": "33138441890"
            }
          },
          "notification_url": "https://eo33xwmcxbzdadd.m.pipedream.net"
          
    }

    const headers = {
      'X-Idempotency-Key': '1'
    };


    api.post('v1/payments', body, { headers }).then(response => {
      setResponsePayment(response)
      setLinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url)
    }).catch(err => alert(err))
  }
  if(statusPayment){
    getStatusPayment()
  }
  return (
    <div className="App">
      <header className="App-header">
        <h2>Pix com API do Mercado pago</h2>

        {
          !responsePayment && <form onSubmit={handleSubmit}>
          <div>
            <label for="nome">Nome</label>
              <input type="text" name="nome" id="" onChange={handleChange} />
          </div>

          <div>
              <label for="email">E-mail</label>
              <input type="text" name="email" id="" onChange={handleChange} />
          </div>

          <div>
              <label for="cpf">CPF</label>
              <input type="text" name="cpf" id="" onChange={handleChange} />
          </div>

          <button type="submit">Pagar</button>
        </form>
        }

        {
          linkBuyMercadoPago &&
          <iframe src={linkBuyMercadoPago} width='400px' height={'620px'} title='link_buy'></iframe>
        }
      </header>
    </div>
  );
}

export {Home};
