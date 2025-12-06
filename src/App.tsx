import { AppBar } from './components/AppBar'
import { ThemeProvider, ThemeMode } from "@/components/theme/theme-provider"
import { FormLayout } from './components/layouts/FormLayout'

function App() {
  return (
    <ThemeProvider defaultTheme={ThemeMode.System} storageKey="vite-ui-theme">
    <div className="min-h-screen">
      <AppBar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <FormLayout/>
      </main>
    </div>
    </ThemeProvider>
  )
}

export default App
