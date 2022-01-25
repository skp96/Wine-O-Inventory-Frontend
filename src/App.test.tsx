import { render, waitFor } from "@testing-library/react"
import { setupServer } from "msw/node"
import { getWinesHandler, errorHandler } from "./mocks/handlers"
import App from "./App"

const server = setupServer(getWinesHandler)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders loading while component fetches data', () => {
    const { getByText } = render(<App />)

    expect(getByText(/loading.../i)).toBeInTheDocument
})

test('fetches and displays a wine list', async () => {
    const { getByRole } = render(<App />)

    await waitFor(() => getByRole('show-inventory'))

    expect(getByRole('show-inventory')).toHaveTextContent(/wine inventory/i)
})

test('displays an error when unable to fetch wines', async () => {
    server.use(errorHandler)

    const { getByRole } = render(<App />)   

    await waitFor(() => getByRole('error'))

    expect(getByRole('error')).toHaveTextContent(/unable to fetch data, please try again/i)
})
