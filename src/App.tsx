import { AppBar } from './components/AppBar'
import { ThemeProvider, ThemeMode } from "@/components/theme/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme={ThemeMode.System} storageKey="vite-ui-theme">
    <div className="min-h-screen">
      <AppBar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Witaj w ZANT</h1>
      </main>
    </div>
    </ThemeProvider>
  )
}

export default App
