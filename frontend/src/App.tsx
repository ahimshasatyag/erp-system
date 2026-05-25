import AppRouter from './routes'
import QueryProvider from './app/providers/QueryProvider'

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  )
}

export default App
