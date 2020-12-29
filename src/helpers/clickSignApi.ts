import axios, { AxiosInstance } from 'axios'

const clickSignAPI: AxiosInstance = axios.create({
  baseURL: 'https://app.clicksign.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Host: 'app.clicksign.com'
  }
})

export default clickSignAPI
