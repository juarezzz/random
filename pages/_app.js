import Navbar from '../components/Navbar'
import ThemeSwitch from '../components/ThemeSwitch'
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem={false}>
      <Navbar />
      <div className='container'>
        <Component {...pageProps} />
        <ThemeSwitch />
      </div>
    </ThemeProvider>
  )
}

export default MyApp
